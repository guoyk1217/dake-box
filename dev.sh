#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Launching DaKeBox Developer Utilities Suite...${NC}"
echo -e "${GREEN}🐍 Starting FastAPI Backend and SQLite3 Engine via uv...${NC}"

# Launch using uv directly
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
