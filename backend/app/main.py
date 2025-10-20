from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import logging

from app.core.config import settings
from app.api.routes import api_router
from app.services.websocket_manager import WebSocketManager
from app.services.ai_service import AIService

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# WebSocket管理器
websocket_manager = WebSocketManager()
ai_service = AIService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("AI Genomics Assistant Backend starting...")
    yield
    logger.info("AI Genomics Assistant Backend shutting down...")

app = FastAPI(
    title="AI Genomics Assistant API",
    description="AI-powered genomics analysis backend with JBrowse 2 integration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    """根路径健康检查"""
    return {
        "message": "AI Genomics Assistant API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """详细健康检查"""
    return {
        "status": "healthy",
        "service": "ai-genomics-backend",
        "version": "1.0.0",
        "features": [
            "FastAPI Backend",
            "WebSocket Support", 
            "AI Analysis Integration",
            "JBrowse 2 Control"
        ]
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket连接端点"""
    await websocket_manager.connect(websocket)
    logger.info("WebSocket client connected")
    
    try:
        while True:
            # 接收客户端消息
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            logger.info(f"Received message: {message_data}")
            
            # 处理不同类型的消息
            if message_data.get("type") == "test_connection":
                await handle_connection_test(websocket, message_data)
            elif message_data.get("type") == "ai_query" or message_data.get("query"):
                await handle_ai_query(websocket, message_data)
            
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

async def handle_ai_query(websocket: WebSocket, message_data: dict):
    """处理AI查询"""
    try:
        query = message_data.get("query", "")
        ai_model_config = message_data.get("ai_model_config", {})
        
        # 使用AI服务处理查询
        response = await ai_service.process_query(query, ai_model_config)
        
        # 发送响应 - 处理datetime序列化
        response_data = {
            "type": "ai_response",
            "response": {
                "content": response.get("content", ""),
                "model_used": response.get("model_used", ""),
                "tool_results": response.get("tool_results", []),
                "test_mode": response.get("test_mode", False),
                "error": response.get("error", None)
            },
            "timestamp": response.get("timestamp").isoformat() if response.get("timestamp") else ""
        }
        
        await websocket.send_text(json.dumps(response_data))
        
    except Exception as e:
        logger.error(f"Error handling AI query: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": f"处理查询时出错: {str(e)}"
        }))

async def handle_connection_test(websocket: WebSocket, message_data: dict):
    """处理连接测试"""
    try:
        config = message_data.get("config", {})
        
        # 提取配置信息
        api_base_url = config.get("apiBaseUrl", "")
        api_key = config.get("apiKey", "")
        model_name = config.get("modelName", "")
        
        logger.info(f"Testing connection for model: {model_name}")
        
        # 使用AI服务进行简单测试
        test_config = {
            "apiBaseUrl": api_base_url,
            "apiKey": api_key,
            "modelName": model_name
        }
        
        # 发送简单的测试消息
        response = await ai_service.process_query("hello", test_config)
        
        # 判断测试是否成功
        success = not response.get("error")
        
        # 发送测试结果
        await websocket.send_text(json.dumps({
            "type": "test_connection_result",
            "success": success,
            "message": "连接测试成功" if success else f"连接测试失败: {response.get('error', '未知错误')}"
        }))
        
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        await websocket.send_text(json.dumps({
            "type": "test_connection_result", 
            "success": False,
            "message": f"连接测试失败: {str(e)}"
        }))
        
    except Exception as e:
        logger.error(f"Error processing AI query: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": f"处理查询时出错: {str(e)}"
        }))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )