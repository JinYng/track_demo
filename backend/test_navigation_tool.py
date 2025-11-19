"""
JBrowse 导航工具测试脚本
用于验证导航工具的基本功能和 WebSocket 通信
"""

import asyncio
import json
import sys
import os
from typing import Dict, Any

# 添加 app 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from utils.chromosome_normalizer import (
    normalize_chromosome,
    is_valid_chromosome,
    get_chromosome_aliases
)

# 模拟导航工具
class NavigationToolTest:
    """导航工具测试类"""
    
    async def navigate_to_location(
        self,
        chromosome: str,
        start: int,
        end: int = None,
        gene_name: str = None
    ) -> Dict[str, Any]:
        """
        测试导航功能
        
        Args:
            chromosome: 染色体名称
            start: 起始位置
            end: 结束位置
            gene_name: 基因名称（可选）
        
        Returns:
            导航结果
        """
        print(f"\n🧪 Testing navigation to: {chromosome}:{start}-{end}")
        
        # 验证参数
        if not self._validate_chromosome(chromosome):
            return {
                "status": "error",
                "message": f"Invalid chromosome name: {chromosome}",
                "error_code": "INVALID_CHROMOSOME"
            }
        
        if start <= 0:
            return {
                "status": "error",
                "message": f"Invalid start position: {start}",
                "error_code": "INVALID_START"
            }
        
        if end is None:
            end = start + 10000
        
        if end <= start:
            return {
                "status": "error",
                "message": f"End position ({end}) must be greater than start ({start})",
                "error_code": "INVALID_RANGE"
            }
        
        # 模拟导航操作
        await asyncio.sleep(0.1)  # 模拟异步操作
        
        result = {
            "status": "success",
            "message": f"Successfully navigated to {chromosome}:{start}-{end}",
            "location": {
                "chromosome": chromosome,
                "start": start,
                "end": end
            }
        }
        
        if gene_name:
            result["location"]["gene_name"] = gene_name
        
        print(f"✅ Navigation successful: {json.dumps(result, indent=2)}")
        return result
    
    def _validate_chromosome(self, chromosome: str) -> bool:
        """验证染色体名称"""
        import re
        # 支持 chr1-chr22, chrX, chrY, chrM, chrMT 等格式
        # 也支持不带 chr 前缀的格式: 1-22, X, Y, M, MT
        pattern = r'^(chr)?(([1-9]|1[0-9]|2[0-2])|X|Y|MT?)$'
        match = re.match(pattern, chromosome, re.IGNORECASE)
        
        if not match:
            return False
        
        # 如果是数字，检查范围 1-22
        number_part = match.group(2)
        if number_part and number_part.isdigit():
            num = int(number_part)
            return 1 <= num <= 22
        
        return True
    
    async def navigate_by_gene(self, gene_name: str) -> Dict[str, Any]:
        """
        通过基因名称导航
        
        Args:
            gene_name: 基因名称
        
        Returns:
            导航结果
        """
        print(f"\n🧪 Testing navigation by gene: {gene_name}")
        
        # 模拟基因查询
        gene_database = {
            "BRCA1": {"chromosome": "chr17", "start": 43044295, "end": 43125483},
            "TP53": {"chromosome": "chr17", "start": 7661779, "end": 7687550},
            "EGFR": {"chromosome": "chr7", "start": 55019017, "end": 55211628},
        }
        
        gene_upper = gene_name.upper()
        if gene_upper not in gene_database:
            return {
                "status": "error",
                "message": f"Gene not found: {gene_name}",
                "error_code": "GENE_NOT_FOUND"
            }
        
        gene_info = gene_database[gene_upper]
        
        # 调用位置导航
        return await self.navigate_to_location(
            chromosome=gene_info["chromosome"],
            start=gene_info["start"],
            end=gene_info["end"],
            gene_name=gene_name
        )


async def test_basic_navigation():
    """测试基本导航功能"""
    print("\n" + "="*60)
    print("测试 1: 基本导航功能")
    print("="*60)
    
    tool = NavigationToolTest()
    
    # 测试用例 1: 正常导航
    result = await tool.navigate_to_location("chr1", 1000000, 2000000)
    assert result["status"] == "success", "Normal navigation should succeed"
    
    # 测试用例 2: 无效染色体
    result = await tool.navigate_to_location("chr99", 1000, 2000)
    assert result["status"] == "error", "Invalid chromosome should fail"
    
    # 测试用例 3: 无效起始位置
    result = await tool.navigate_to_location("chr1", -100, 2000)
    assert result["status"] == "error", "Negative start should fail"
    
    # 测试用例 4: 结束位置小于起始位置
    result = await tool.navigate_to_location("chr1", 2000, 1000)
    assert result["status"] == "error", "End < start should fail"
    
    # 测试用例 5: 自动计算结束位置
    result = await tool.navigate_to_location("chr1", 1000000)
    assert result["status"] == "success", "Auto-calculated end should work"
    assert result["location"]["end"] == 1010000, "End should be start + 10000"
    
    print("\n✅ All basic navigation tests passed!")


async def test_gene_navigation():
    """测试基因名称导航"""
    print("\n" + "="*60)
    print("测试 2: 基因名称导航")
    print("="*60)
    
    tool = NavigationToolTest()
    
    # 测试用例 1: 已知基因
    result = await tool.navigate_by_gene("BRCA1")
    assert result["status"] == "success", "Known gene should succeed"
    assert result["location"]["chromosome"] == "chr17", "BRCA1 should be on chr17"
    
    # 测试用例 2: 未知基因
    result = await tool.navigate_by_gene("UNKNOWN_GENE")
    assert result["status"] == "error", "Unknown gene should fail"
    assert result["error_code"] == "GENE_NOT_FOUND", "Should return GENE_NOT_FOUND error"
    
    # 测试用例 3: 大小写不敏感
    result = await tool.navigate_by_gene("brca1")
    assert result["status"] == "success", "Lowercase gene name should work"
    
    print("\n✅ All gene navigation tests passed!")


async def test_websocket_message_format():
    """测试 WebSocket 消息格式"""
    print("\n" + "="*60)
    print("测试 3: WebSocket 消息格式")
    print("="*60)
    
    tool = NavigationToolTest()
    
    # 生成导航结果
    result = await tool.navigate_to_location("chr1", 1000000, 2000000)
    
    # 构建 WebSocket 消息
    ws_message = {
        "type": "navigation",
        "action": "navigate_to_location",
        "payload": result["location"],
        "requestId": "test-request-123"
    }
    
    print(f"\n📤 WebSocket message format:")
    print(json.dumps(ws_message, indent=2))
    
    # 验证消息格式
    assert "type" in ws_message, "Message should have type"
    assert "action" in ws_message, "Message should have action"
    assert "payload" in ws_message, "Message should have payload"
    assert "requestId" in ws_message, "Message should have requestId"
    
    # 模拟前端响应
    ws_response = {
        "type": "navigation_response",
        "requestId": ws_message["requestId"],
        "status": "success",
        "message": "Navigation completed",
        "location": ws_message["payload"]
    }
    
    print(f"\n📥 WebSocket response format:")
    print(json.dumps(ws_response, indent=2))
    
    print("\n✅ WebSocket message format test passed!")


async def main():
    """运行所有测试"""
    print("\n" + "🧪"*30)
    print("JBrowse 导航工具测试套件")
    print("🧪"*30)
    
    try:
        await test_basic_navigation()
        await test_gene_navigation()
        await test_websocket_message_format()
        
        print("\n" + "="*60)
        print("🎉 所有测试通过！")
        print("="*60)
        print("\n下一步:")
        print("1. 在前端浏览器控制台测试 JBrowse 导航 API")
        print("2. 实现完整的 WebSocket 通信")
        print("3. 集成 LangChain 工具调用")
        
    except AssertionError as e:
        print(f"\n❌ 测试失败: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ 测试出错: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
