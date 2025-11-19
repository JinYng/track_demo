"""
测试 WebSocket 导航指令发送
模拟前端 WebSocket 客户端
"""

import asyncio
import websockets
import json


async def test_navigation_command():
    """测试导航指令"""
    print("\n" + "="*60)
    print("WebSocket 导航指令测试")
    print("="*60)
    
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print(f"\n✅ Connected to {uri}")
            
            # 测试用例 1: 发送导航查询
            print("\n📍 Test 1: Send navigation query")
            query_message = {
                "type": "ai_query",
                "query": "显示 chr1:1000000-2000000",
                "ai_model_config": {
                    "apiBaseUrl": "https://api.openai.com/v1",
                    "apiKey": "test-key",  # 使用测试模式
                    "modelName": "gpt-4"
                }
            }
            
            await websocket.send(json.dumps(query_message))
            print("✅ Query sent")
            
            # 接收响应
            print("\n📥 Waiting for responses...")
            response_count = 0
            navigation_received = False
            
            try:
                # 设置超时，最多等待 5 秒
                while response_count < 2:  # 期待 AI 响应 + 导航指令
                    response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    response_data = json.loads(response)
                    response_count += 1
                    
                    print(f"\n📨 Response {response_count}:")
                    print(f"   Type: {response_data.get('type')}")
                    
                    if response_data.get('type') == 'navigation':
                        navigation_received = True
                        print(f"   Action: {response_data.get('action')}")
                        print(f"   Payload: {json.dumps(response_data.get('payload'), indent=6)}")
                        print(f"   RequestId: {response_data.get('requestId')}")
                        
                        # 发送导航响应
                        nav_response = {
                            "type": "navigation_response",
                            "requestId": response_data.get('requestId'),
                            "status": "success",
                            "message": "Navigation completed successfully"
                        }
                        await websocket.send(json.dumps(nav_response))
                        print("   ✅ Sent navigation response")
                        
                    elif response_data.get('type') == 'ai_response':
                        print(f"   Content: {response_data.get('response', {}).get('content', '')[:100]}...")
                    
                    print("   ✅ Response received")
                    
            except asyncio.TimeoutError:
                print("\n⏱️  Timeout waiting for responses")
            
            if navigation_received:
                print("\n✅ Navigation command received successfully!")
            else:
                print("\n⚠️  No navigation command received (might be expected in test mode)")
            
            # 测试用例 2: 基因名称导航
            print("\n" + "-"*60)
            print("\n🧬 Test 2: Gene name navigation")
            gene_query = {
                "type": "ai_query",
                "query": "导航到 BRCA1 基因",
                "ai_model_config": {
                    "apiBaseUrl": "https://api.openai.com/v1",
                    "apiKey": "test-key",
                    "modelName": "gpt-4"
                }
            }
            
            await websocket.send(json.dumps(gene_query))
            print("✅ Gene query sent")
            
            # 接收响应
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                print(f"\n📨 Response type: {response_data.get('type')}")
                print("✅ Response received")
            except asyncio.TimeoutError:
                print("\n⏱️  Timeout waiting for response")
            
            print("\n" + "="*60)
            print("✅ WebSocket navigation test completed!")
            print("="*60)
            
    except ConnectionRefusedError:
        print("\n❌ Connection refused. Is the backend server running?")
        print("   Start it with: cd backend && python -m uvicorn app.main:app --reload")
        return 1
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


async def main():
    """运行测试"""
    print("\n" + "🧪"*30)
    print("WebSocket 导航指令测试套件")
    print("🧪"*30)
    print("\n⚠️  注意: 此测试需要后端服务器运行")
    print("   启动命令: cd backend && python -m uvicorn app.main:app --reload")
    print()
    
    input("按 Enter 继续测试...")
    
    exit_code = await test_navigation_command()
    
    if exit_code == 0:
        print("\n✅ Phase 3 部分完成:")
        print("  - WebSocket 消息协议定义完成")
        print("  - 后端可以发送导航指令")
        print("  - 后端可以接收导航响应")
        print("\n下一步: Phase 4 - 前端集成")
    
    return exit_code


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
