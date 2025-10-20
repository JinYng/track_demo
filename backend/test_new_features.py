#!/usr/bin/env python3
"""
测试新功能：连接状态指示灯和Markdown渲染
"""

import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_connection_status():
    """测试连接状态功能"""
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            logger.info("WebSocket连接成功!")
            
            # 测试连接状态检查
            test_config_message = {
                "type": "test_connection",
                "config": {
                    "apiBaseUrl": "https://api.openai.com/v1",
                    "apiKey": "test-key",
                    "modelName": "gpt-4"
                }
            }
            
            logger.info("发送连接测试消息...")
            await websocket.send(json.dumps(test_config_message))
            
            # 接收连接测试响应
            response = await websocket.recv()
            response_data = json.loads(response)
            logger.info(f"连接测试响应: {response_data}")
            
            # 测试带Markdown的AI查询
            markdown_query = {
                "query": "请用Markdown格式回复，包含代码块、列表和加粗文本",
                "ai_model_config": {
                    "apiBaseUrl": "https://api.openai.com/v1",
                    "apiKey": "test-key",
                    "modelName": "gpt-4"
                }
            }
            
            logger.info("发送Markdown测试查询...")
            await websocket.send(json.dumps(markdown_query))
            
            # 接收AI响应
            ai_response = await websocket.recv()
            ai_data = json.loads(ai_response)
            logger.info(f"AI响应: {ai_data}")
            
    except Exception as e:
        logger.error(f"测试失败: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("测试新功能：连接状态指示灯 + Markdown渲染")
    print("=" * 60)
    
    asyncio.run(test_connection_status())
    
    print("\n" + "=" * 60)
    print("测试完成!")
    print("请在前端界面中验证：")
    print("1. 模型配置区域应显示连接状态指示灯")
    print("2. AI回复应支持Markdown格式渲染")
    print("=" * 60)