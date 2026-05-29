import sqlite3
import hashlib
import base64
import time
import json
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

# Define Database Name
DB_NAME = "dakebox.db"

def init_db():
    """Initializes the SQLite3 database and creates the tool_history table if missing."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tool_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tool_type TEXT NOT NULL,
            input_preview TEXT,
            output_preview TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan events to manage DB setup on boot."""
    init_db()
    yield

# Initialize FastAPI App
app = FastAPI(
    title="DaKeBox API",
    description="Clean, premium, Python-only developer utilities suite",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local cross-origin connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Helper Functions
def add_history_entry(tool_type: str, input_str: str, output_str: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Keep previews limited to 150 characters
        input_preview = (input_str[:150] + "...") if len(input_str) > 150 else input_str
        output_preview = (output_str[:150] + "...") if len(output_str) > 150 else output_str
        
        cursor.execute(
            "INSERT INTO tool_history (tool_type, input_preview, output_preview) VALUES (?, ?, ?)",
            (tool_type, input_preview, output_preview)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database error writing log: {e}")

# Pydantic Schemas
class JSONFormatRequest(BaseModel):
    content: str = Field(..., description="The JSON string to format")
    indent: int = Field(2, description="Indentation spaces")
    minify: bool = Field(False, description="Whether to minify instead of formatting")

class JSONFormatResponse(BaseModel):
    success: bool
    result: str
    error: str = None

class HashRequest(BaseModel):
    content: str = Field(..., description="Text content to hash or encode")
    algorithm: str = Field("md5", description="Supported: md5, sha256, base64_encode, base64_decode")

class HashResponse(BaseModel):
    success: bool
    result: str
    error: str = None

class TimestampConvertRequest(BaseModel):
    value: str = Field(..., description="Timestamp or datetime string")
    direction: str = Field("auto", description="Supported: auto, ts_to_date, date_to_ts")

class TimestampConvertResponse(BaseModel):
    success: bool
    timestamp_seconds: int = None
    datetime_str: str = None
    error: str = None

class HistoryResponse(BaseModel):
    id: int
    tool_type: str
    input_preview: str
    output_preview: str
    created_at: str

# ----------------- FastAPI API Routes -----------------

@app.post("/api/formatters/json", response_model=JSONFormatResponse)
async def format_json(request: JSONFormatRequest):
    content_str = request.content.strip()
    if not content_str:
        return JSONFormatResponse(success=False, result="", error="输入为空")

    try:
        parsed = json.loads(content_str)
        if request.minify:
            result = json.dumps(parsed, separators=(',', ':'))
        else:
            result = json.dumps(parsed, indent=request.indent)
        
        # Async-logged to SQLite
        add_history_entry("json", content_str, result)
        return JSONFormatResponse(success=True, result=result)
    except json.JSONDecodeError as e:
        err_msg = f"无效 JSON：错误发生在第 {e.lineno} 行，第 {e.colno} 列。"
        return JSONFormatResponse(success=False, result="", error=err_msg)
    except Exception as e:
        return JSONFormatResponse(success=False, result="", error=str(e))

@app.post("/api/encoders/process", response_model=HashResponse)
async def process_hashing(request: HashRequest):
    content_bytes = request.content.encode("utf-8")
    algorithm = request.algorithm.lower().strip()

    try:
        if algorithm == "md5":
            result = hashlib.md5(content_bytes).hexdigest()
        elif algorithm == "sha256":
            result = hashlib.sha256(content_bytes).hexdigest()
        elif algorithm == "base64_encode":
            result = base64.b64encode(content_bytes).decode("utf-8")
        elif algorithm == "base64_decode":
            try:
                result = base64.b64decode(content_bytes).decode("utf-8")
            except UnicodeDecodeError:
                result = base64.b64decode(content_bytes).hex()
        else:
            return HashResponse(success=False, result="", error=f"不支持的算法: {algorithm}")

        # Async-logged to SQLite
        add_history_entry("hash", request.content, result)
        return HashResponse(success=True, result=result)
    except Exception as e:
        return HashResponse(success=False, result="", error=str(e))

@app.post("/api/converters/timestamp", response_model=TimestampConvertResponse)
async def convert_timestamp(request: TimestampConvertRequest):
    val = request.value.strip()
    direction = request.direction.lower().strip()

    if not val:
        return TimestampConvertResponse(success=False, error="输入为空")

    try:
        # Timestamp to Date
        if direction == "ts_to_date" or (direction == "auto" and val.isdigit()):
            ts = int(val)
            if ts > 9999999999:
                ts = ts / 1000.0
            dt = datetime.fromtimestamp(ts, timezone.utc)
            dt_str = dt.strftime("%Y-%m-%d %H:%M:%S") + " UTC"
            res = TimestampConvertResponse(success=True, timestamp_seconds=int(ts), datetime_str=dt_str)
            add_history_entry("timestamp", val, dt_str)
            return res

        # Date to Timestamp
        else:
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d %H:%M",
                "%Y-%m-%d",
                "%Y/%m/%d %H:%M:%S",
                "%Y/%m/%d"
            ]
            dt = None
            for fmt in formats:
                try:
                    dt = datetime.strptime(val, fmt)
                    break
                except ValueError:
                    continue
            
            if dt is None:
                return TimestampConvertResponse(success=False, error="日期时间字符串格式不识别，请使用 YYYY-MM-DD HH:MM:SS 格式。")
            
            ts = int(dt.replace(tzinfo=timezone.utc).timestamp())
            dt_str = dt.strftime("%Y-%m-%d %H:%M:%S") + " UTC"
            res = TimestampConvertResponse(success=True, timestamp_seconds=ts, datetime_str=dt_str)
            add_history_entry("timestamp", val, str(ts))
            return res

    except Exception as e:
        return TimestampConvertResponse(success=False, error=str(e))

@app.get("/api/history", response_model=list[HistoryResponse])
async def get_history():
    """Fetches the last 15 tool execution history entries from SQLite3."""
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT id, tool_type, input_preview, output_preview, created_at FROM tool_history ORDER BY id DESC LIMIT 15")
        rows = cursor.fetchall()
        conn.close()
        
        result = []
        for r in rows:
            result.append(HistoryResponse(
                id=r["id"],
                tool_type=r["tool_type"],
                input_preview=r["input_preview"],
                output_preview=r["output_preview"],
                created_at=r["created_at"]
            ))
        return result
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []

# Serve static web interface
@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
