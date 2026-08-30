"""
SQL-backed data layer that mimics the small subset of the Motor/PyMongo async
collection API actually used across app/routes/*.py (find, find_one, insert_one,
insert_many, update_one, update_many, delete_one, delete_many, count_documents,
plus cursor .sort()/.skip()/.limit()/.to_list()).

Each "collection" is a real SQL table of the shape (_rowid PK, doc JSON/TEXT).
Documents are stored as JSON blobs — this keeps every route file that talks to
`db.<collection>` unchanged while genuinely persisting to a real SQL database
(SQLite by default, MySQL when DB_ENGINE=mysql) instead of MongoDB. Filtering,
sorting and pagination are applied in Python against the decoded documents,
which is simple, dialect-agnostic, and fast enough at this app's data volumes.
"""
import re
import json
from types import SimpleNamespace
from app.config import DB_ENGINE, SQLITE_PATH, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE

COLLECTIONS = [
    "users", "categories", "providers", "bookings", "reviews", "jobs",
    "chat_messages", "advertisements", "billing_transactions",
    "contact_messages", "hero_slides", "jobseekers", "locations",
    "media", "system_settings",
]

engine = None
_db = None


# ---------------------------------------------------------
# Engines: thin async wrappers exposing the same low-level
# table operations for SQLite (default, zero-install) and
# MySQL (when DB_ENGINE=mysql and a server is reachable).
# ---------------------------------------------------------
class SQLiteEngine:
    def __init__(self, path):
        self.path = path
        self.conn = None

    async def connect(self):
        import aiosqlite
        import os
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        self.conn = await aiosqlite.connect(self.path)
        await self.conn.execute("PRAGMA journal_mode=WAL")

    async def ensure_table(self, table):
        await self.conn.execute(
            f'CREATE TABLE IF NOT EXISTS "{table}" (_rowid INTEGER PRIMARY KEY AUTOINCREMENT, doc TEXT NOT NULL)'
        )
        await self.conn.commit()

    async def select_all(self, table):
        await self.ensure_table(table)
        cur = await self.conn.execute(f'SELECT _rowid, doc FROM "{table}"')
        rows = await cur.fetchall()
        return [(r[0], json.loads(r[1])) for r in rows]

    async def insert(self, table, doc):
        await self.ensure_table(table)
        await self.conn.execute(f'INSERT INTO "{table}" (doc) VALUES (?)', (json.dumps(doc, default=str),))
        await self.conn.commit()

    async def update_by_rowid(self, table, rowid, doc):
        await self.conn.execute(f'UPDATE "{table}" SET doc = ? WHERE _rowid = ?', (json.dumps(doc, default=str), rowid))
        await self.conn.commit()

    async def delete_by_rowid(self, table, rowid):
        await self.conn.execute(f'DELETE FROM "{table}" WHERE _rowid = ?', (rowid,))
        await self.conn.commit()

    async def ensure_uploads_table(self):
        await self.conn.execute(
            'CREATE TABLE IF NOT EXISTS "uploads" ('
            'id VARCHAR(64) PRIMARY KEY, filename TEXT, contentType TEXT, length INTEGER, '
            'metadata TEXT, fileData BLOB, createdAt TEXT)'
        )
        await self.conn.commit()

    async def save_upload(self, file_id, filename, content_type, data, metadata, created_at):
        await self.ensure_uploads_table()
        await self.conn.execute(
            'INSERT INTO uploads (id, filename, contentType, length, metadata, fileData, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (file_id, filename, content_type, len(data), json.dumps(metadata), data, created_at)
        )
        await self.conn.commit()

    async def get_upload(self, file_id):
        await self.ensure_uploads_table()
        cur = await self.conn.execute('SELECT filename, contentType, length, metadata, fileData FROM uploads WHERE id = ?', (file_id,))
        row = await cur.fetchone()
        if not row:
            return None
        return {"filename": row[0], "contentType": row[1], "length": row[2], "metadata": json.loads(row[3] or "{}"), "fileData": row[4]}

    async def delete_upload(self, file_id):
        await self.ensure_uploads_table()
        await self.conn.execute('DELETE FROM uploads WHERE id = ?', (file_id,))
        await self.conn.commit()


class MySQLEngine:
    def __init__(self, host, port, user, password, database):
        self.host, self.port, self.user, self.password, self.database = host, port, user, password, database
        self.pool = None

    async def connect(self):
        import aiomysql
        # Create the target database first if it doesn't exist yet.
        root_conn = await aiomysql.connect(host=self.host, port=self.port, user=self.user, password=self.password, autocommit=True)
        async with root_conn.cursor() as cur:
            await cur.execute(f"CREATE DATABASE IF NOT EXISTS `{self.database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        root_conn.close()
        self.pool = await aiomysql.create_pool(
            host=self.host, port=self.port, user=self.user, password=self.password,
            db=self.database, charset="utf8mb4", autocommit=True
        )

    async def ensure_table(self, table):
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"CREATE TABLE IF NOT EXISTS `{table}` (_rowid INT PRIMARY KEY AUTO_INCREMENT, doc JSON NOT NULL) "
                    "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
                )

    async def select_all(self, table):
        await self.ensure_table(table)
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(f"SELECT _rowid, doc FROM `{table}`")
                rows = await cur.fetchall()
        return [(r[0], json.loads(r[1])) for r in rows]

    async def insert(self, table, doc):
        await self.ensure_table(table)
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(f"INSERT INTO `{table}` (doc) VALUES (%s)", (json.dumps(doc, default=str),))

    async def update_by_rowid(self, table, rowid, doc):
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(f"UPDATE `{table}` SET doc = %s WHERE _rowid = %s", (json.dumps(doc, default=str), rowid))

    async def delete_by_rowid(self, table, rowid):
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(f"DELETE FROM `{table}` WHERE _rowid = %s", (rowid,))

    async def ensure_uploads_table(self):
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    "CREATE TABLE IF NOT EXISTS `uploads` ("
                    "id VARCHAR(64) PRIMARY KEY, filename TEXT, contentType VARCHAR(150), length BIGINT, "
                    "metadata JSON, fileData LONGBLOB, createdAt VARCHAR(50)"
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
                )

    async def save_upload(self, file_id, filename, content_type, data, metadata, created_at):
        await self.ensure_uploads_table()
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    "INSERT INTO uploads (id, filename, contentType, length, metadata, fileData, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                    (file_id, filename, content_type, len(data), json.dumps(metadata), data, created_at)
                )

    async def get_upload(self, file_id):
        await self.ensure_uploads_table()
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT filename, contentType, length, metadata, fileData FROM uploads WHERE id = %s", (file_id,))
                row = await cur.fetchone()
        if not row:
            return None
        return {"filename": row[0], "contentType": row[1], "length": row[2], "metadata": json.loads(row[3] or "{}"), "fileData": row[4]}

    async def delete_upload(self, file_id):
        await self.ensure_uploads_table()
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute("DELETE FROM uploads WHERE id = %s", (file_id,))


# ---------------------------------------------------------
# Mongo-style filter matching / update application (pure Python,
# operates on decoded documents — no SQL dialect involved).
# ---------------------------------------------------------
def _match_field(value, cond):
    if isinstance(cond, dict) and any(isinstance(k, str) and k.startswith("$") for k in cond.keys()):
        for op, opval in cond.items():
            if op == "$ne":
                if value == opval:
                    return False
            elif op == "$in":
                if isinstance(value, list):
                    if not any(v in opval for v in value):
                        return False
                elif value not in opval:
                    return False
            elif op == "$gte":
                if value is None or not (value >= opval):
                    return False
            elif op == "$lte":
                if value is None or not (value <= opval):
                    return False
            elif op == "$regex":
                flags = re.IGNORECASE if cond.get("$options") == "i" else 0
                if isinstance(value, list):
                    if not any(re.search(opval, v or "", flags) for v in value):
                        return False
                else:
                    if not re.search(opval, value or "", flags):
                        return False
            # "$options" is consumed alongside "$regex" above; nothing to do standalone.
        return True
    return value == cond


def _match(doc, filt):
    if not filt:
        return True
    for key, cond in filt.items():
        if key == "$or":
            if not any(_match(doc, sub) for sub in cond):
                return False
        elif key == "$and":
            if not all(_match(doc, sub) for sub in cond):
                return False
        else:
            if not _match_field(doc.get(key), cond):
                return False
    return True


def _apply_update(doc, update):
    new_doc = dict(doc)
    for op, fields in update.items():
        if op == "$set":
            new_doc.update(fields)
        elif op == "$inc":
            for k, v in fields.items():
                new_doc[k] = (new_doc.get(k) or 0) + v
        else:
            raise NotImplementedError(f"Unsupported update operator: {op}")
    return new_doc


def _project(doc, projection):
    if not projection:
        return doc
    keys = [k for k, v in projection.items() if v == 1 and k != "_id"]
    if not keys:
        return doc
    return {k: doc.get(k) for k in keys}


def _sort_key(value):
    return (value is None, value if value is not None else 0)


class Cursor:
    def __init__(self, collection, filt, projection):
        self.collection = collection
        self.filt = filt or {}
        self.projection = projection
        self._sort = None
        self._skip = 0
        self._limit = None

    def sort(self, key_or_list, direction=None):
        if isinstance(key_or_list, str):
            self._sort = [(key_or_list, direction if direction is not None else 1)]
        else:
            self._sort = list(key_or_list)
        return self

    def skip(self, n):
        self._skip = n
        return self

    def limit(self, n):
        self._limit = n
        return self

    async def _matched_docs(self):
        rows = await self.collection.engine.select_all(self.collection.table)
        return [doc for _, doc in rows if _match(doc, self.filt)]

    async def to_list(self, length=None):
        matched = await self._matched_docs()
        if self._sort:
            for key, direction in reversed(self._sort):
                matched.sort(key=lambda d: _sort_key(d.get(key)), reverse=(direction == -1))
        if self._skip:
            matched = matched[self._skip:]
        limit = length if length is not None else self._limit
        if limit is not None:
            matched = matched[:limit]
        if self.projection:
            matched = [_project(d, self.projection) for d in matched]
        return matched

    def __aiter__(self):
        self._iter_cache = None
        return self

    async def __anext__(self):
        if self._iter_cache is None:
            self._iter_cache = await self.to_list()
            self._iter_pos = 0
        if self._iter_pos >= len(self._iter_cache):
            raise StopAsyncIteration
        item = self._iter_cache[self._iter_pos]
        self._iter_pos += 1
        return item


class Collection:
    def __init__(self, eng, table):
        self.engine = eng
        self.table = table

    def find(self, filt=None, projection=None):
        return Cursor(self, filt, projection)

    async def find_one(self, filt=None, projection=None):
        results = await Cursor(self, filt, projection).to_list(length=1)
        return results[0] if results else None

    async def insert_one(self, doc):
        await self.engine.insert(self.table, doc)
        return SimpleNamespace(inserted_id=doc.get("id"))

    async def insert_many(self, docs):
        for d in docs:
            await self.engine.insert(self.table, d)
        return SimpleNamespace(inserted_ids=[d.get("id") for d in docs])

    async def _matched_rows(self, filt):
        rows = await self.engine.select_all(self.table)
        return [(rowid, doc) for rowid, doc in rows if _match(doc, filt)]

    async def update_one(self, filt, update, upsert=False):
        matched = await self._matched_rows(filt)
        if matched:
            rowid, doc = matched[0]
            new_doc = _apply_update(doc, update)
            await self.engine.update_by_rowid(self.table, rowid, new_doc)
            return SimpleNamespace(matched_count=1, modified_count=1)
        if upsert:
            base = {k: v for k, v in (filt or {}).items() if not k.startswith("$") and not isinstance(v, dict)}
            new_doc = _apply_update(base, update)
            await self.engine.insert(self.table, new_doc)
            return SimpleNamespace(matched_count=0, modified_count=0, upserted_id=new_doc.get("id"))
        return SimpleNamespace(matched_count=0, modified_count=0)

    async def update_many(self, filt, update):
        matched = await self._matched_rows(filt)
        for rowid, doc in matched:
            await self.engine.update_by_rowid(self.table, rowid, _apply_update(doc, update))
        return SimpleNamespace(matched_count=len(matched), modified_count=len(matched))

    async def delete_one(self, filt):
        matched = await self._matched_rows(filt)
        if matched:
            await self.engine.delete_by_rowid(self.table, matched[0][0])
            return SimpleNamespace(deleted_count=1)
        return SimpleNamespace(deleted_count=0)

    async def delete_many(self, filt):
        matched = await self._matched_rows(filt)
        for rowid, _ in matched:
            await self.engine.delete_by_rowid(self.table, rowid)
        return SimpleNamespace(deleted_count=len(matched))

    async def count_documents(self, filt=None):
        matched = await self._matched_rows(filt or {})
        return len(matched)


class Database:
    def __init__(self, eng):
        self._engine = eng
        self._cache = {}

    def __getattr__(self, name):
        if name not in self._cache:
            self._cache[name] = Collection(self._engine, name)
        return self._cache[name]

    def __getitem__(self, name):
        return getattr(self, name)


async def init_db():
    global engine, _db
    if DB_ENGINE == "mysql":
        try:
            engine = MySQLEngine(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
            await engine.connect()
            print(f"[DB] Connected to MySQL at {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
        except Exception as e:
            print(f"[DB] MySQL not available ({e}). Falling back to local SQLite at {SQLITE_PATH}")
            engine = SQLiteEngine(SQLITE_PATH)
            await engine.connect()
    else:
        engine = SQLiteEngine(SQLITE_PATH)
        await engine.connect()
        print(f"[DB] Using local SQLite database at {SQLITE_PATH}")

    for table in COLLECTIONS:
        await engine.ensure_table(table)

    _db = Database(engine)


def get_db():
    global engine, _db
    if _db is None:
        engine = SQLiteEngine(SQLITE_PATH)
        _db = Database(engine)
    return _db


async def save_upload(file_id, filename, content_type, data, metadata, created_at):
    return await get_db()._engine.save_upload(file_id, filename, content_type, data, metadata, created_at)


async def get_upload(file_id):
    return await get_db()._engine.get_upload(file_id)


async def delete_upload(file_id):
    return await get_db()._engine.delete_upload(file_id)


def clean_doc(doc):
    if not doc:
        return doc
    if isinstance(doc, list):
        return [clean_doc(item) for item in doc]
    if isinstance(doc, dict):
        return {k: clean_doc(v) if isinstance(v, (dict, list)) else v for k, v in doc.items() if k != "_id"}
    return doc
