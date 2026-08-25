import os
import sys
import uvicorn

# Ensure the backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting Search2Service Python Backend on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
