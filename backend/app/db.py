import io
import asyncio
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from app.config import MONGO_URL, DB_NAME

client = None
db = None
bucket = None

class MockGridOut:
    def __init__(self, data: bytes, metadata: dict, filename: str):
        self._data = data
        self._pos = 0
        self.length = len(data)
        self.metadata = metadata
        self.filename = filename

    async def readchunk(self):
        if self._pos >= len(self._data):
            return b""
        chunk = self._data[self._pos:self._pos + 255 * 1024]
        self._pos += len(chunk)
        return chunk

class MockGridIn:
    def __init__(self, files_col, file_id: ObjectId, filename: str, metadata: dict):
        self._files_col = files_col
        self._id = file_id
        self.filename = filename
        self.metadata = metadata
        self._buffer = io.BytesIO()

    async def write(self, data: bytes):
        self._buffer.write(data)

    async def close(self):
        data = self._buffer.getvalue()
        await self._files_col.insert_one({
            "_id": self._id,
            "filename": self.filename,
            "length": len(data),
            "contentType": self.metadata.get("declaredMimeType", "application/octet-stream"),
            "metadata": self.metadata,
            "_data": data
        })

class MockGridFSBucket:
    def __init__(self, database):
        self.db = database
        self.files = database["uploads.files"]

    def open_upload_stream(self, filename: str, metadata: dict = None):
        return MockGridIn(self.files, ObjectId(), filename, metadata or {})

    async def open_download_stream(self, file_id: ObjectId):
        doc = await self.files.find_one({"_id": file_id})
        if not doc:
            raise FileNotFoundError(f"File {file_id} not found in GridFS")
        return MockGridOut(doc.get("_data", b""), doc.get("metadata", {}), doc.get("filename", "file"))

    async def delete(self, file_id: ObjectId):
        await self.files.delete_one({"_id": file_id})

async def init_db():
    global client, db, bucket
    try:
        real_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=1500)
        # Test connection
        await real_client.admin.command('ping')
        client = real_client
        db = client[DB_NAME]
        bucket = AsyncIOMotorGridFSBucket(db, bucket_name="uploads", chunk_size_bytes=255 * 1024)
        print(f"[DB] Connected to MongoDB at {MONGO_URL}")
    except Exception as e:
        print(f"[DB] Real MongoDB not available ({e}). Initializing In-Memory MongoMock database.")
        from mongomock_motor import AsyncMongoMockClient
        client = AsyncMongoMockClient()
        db = client[DB_NAME]
        bucket = MockGridFSBucket(db)

def get_client():
    global client
    if client is None:
        from mongomock_motor import AsyncMongoMockClient
        client = AsyncMongoMockClient()
    return client

def get_db():
    global db
    if db is None:
        c = get_client()
        db = c[DB_NAME]
    return db

def get_files_bucket():
    global bucket
    if bucket is None:
        database = get_db()
        bucket = MockGridFSBucket(database)
    return bucket

def clean_doc(doc):
    if not doc:
        return doc
    if isinstance(doc, list):
        return [clean_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for k, v in doc.items():
            if k == '_id':
                continue
            elif isinstance(v, ObjectId):
                result[k] = str(v)
            elif isinstance(v, (dict, list)):
                result[k] = clean_doc(v)
            else:
                result[k] = v
        return result
    return doc
