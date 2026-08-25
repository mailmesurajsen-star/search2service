"""
Search2Service - MySQL Database Setup Script
This script connects to your MySQL server, creates the `search2service` database,
and executes all table creation and initial seed scripts from `database_schema.sql`.

Usage:
    python setup_mysql.py
"""

import os
import sys

def setup():
    try:
        import pymysql
    except ImportError:
        print("[!] 'pymysql' package is not installed. Installing pymysql...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pymysql", "cryptography"])
        import pymysql

    # Read configuration from environment or prompt
    host = os.getenv("MYSQL_HOST", "localhost")
    port = int(os.getenv("MYSQL_PORT", 3306))
    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD", "")
    db_name = os.getenv("MYSQL_DATABASE", "search2service")

    print("=" * 60)
    print("  Search2Service MySQL Database Setup")
    print("=" * 60)
    print(f"Connecting to MySQL Host: {host}:{port} with user: {user} ...")

    try:
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
    except Exception as e:
        print(f"\n[ERROR] Failed to connect to MySQL server: {e}")
        print("\nSuggestions:")
        print("1. Ensure MySQL service (XAMPP / Wamp / MySQL Server) is running.")
        print("2. Check host, port, user and password settings.")
        return False

    with connection.cursor() as cursor:
        print(f"[+] Creating database '{db_name}' if not exists...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute(f"USE `{db_name}`;")

        # Load SQL schema file
        sql_file = os.path.join(os.path.dirname(__file__), "database_schema.sql")
        if not os.path.exists(sql_file):
            print(f"[ERROR] SQL schema file not found at: {sql_file}")
            return False

        with open(sql_file, "r", encoding="utf-8") as f:
            sql_content = f.read()

        # Split into statements
        statements = sql_content.split(";")
        executed_count = 0
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt:
                continue
            # Skip pure comment statements
            lines = [l for l in stmt.split("\n") if not l.strip().startswith("--")]
            clean_stmt = "\n".join(lines).strip()
            if not clean_stmt:
                continue
            try:
                cursor.execute(clean_stmt)
                executed_count += 1
            except Exception as ex:
                print(f"[!] Warning executing statement: {ex}")

        print(f"[SUCCESS] Database '{db_name}' and tables created successfully! ({executed_count} statements executed)")

        # Verify tables
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(f"\nCreated Tables in `{db_name}`:")
        for t in tables:
            print(f"  - {list(t.values())[0]}")

    connection.close()
    print("\n[OK] Setup complete! You are ready to use MySQL with Search2Service.")
    return True

if __name__ == "__main__":
    setup()
