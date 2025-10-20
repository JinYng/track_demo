#!/usr/bin/env python3
"""
AI Genomics Assistant Backend Development Server
"""

import uvicorn
import sys
import os

# 添加app目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

if __name__ == "__main__":
    print("Starting AI Genomics Assistant Backend...")
    print("Features: FastAPI + WebSocket + LangChain + JBrowse Tools")
    print("API Docs: http://localhost:8000/docs")
    print("WebSocket: ws://localhost:8000/ws")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )