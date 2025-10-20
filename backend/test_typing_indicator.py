#!/usr/bin/env python3
"""
测试动态处理指示器功能
"""

import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_typing_indicator():
    """测试动态处理指示器"""
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            logger.info("WebSocket连接成功!")
            
            # 发送一个需要较长处理时间的查询
            test_query = {
                "query": "请详细解释基因组学中的SNP变异分析流程，包括质量控制、比对、变异检测和注释等步骤",
                "ai_model_config": {
                    "apiBaseUrl": "https://api.openai.com/v1",
                    "apiKey": "test-key",
                    "modelName": "gpt-4"
                }
            }
            
            logger.info("发送复杂查询，测试处理指示器...")
            await websocket.send(json.dumps(test_query))
            
            # 接收响应
            response = await websocket.recv()
            response_data = json.loads(response)
            
            logger.info("收到响应:")
            if response_data.get('response', {}).get('content'):
                content = response_data['response']['content']
                logger.info(f"响应内容: {content[:100]}...")
            else:
                logger.info(f"响应数据: {response_data}")
            
    except Exception as e:
        logger.error(f"测试失败: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("测试动态处理指示器功能")
    print("=" * 60)
    print("1. 启动前端应用")
    print("2. 发送消息后观察动态点数变化")
    print("3. 从3个点逐渐增加到6个点，然后循环")
    print("=" * 60)
    
    asyncio.run(test_typing_indicator())
    
    print("\n" + "=" * 60)
    print("测试完成!")
    print("请在前端界面验证:")
    print("- 发送消息后立即显示'我正在处理你的问题...'")
    print("- 点数从3个逐渐增加到6个，然后循环")
    print("- 收到AI回复后指示器消失")
    print("=" * 60)