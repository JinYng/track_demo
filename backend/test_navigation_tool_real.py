"""
测试真实的 NavigationTool 类
"""

import asyncio
import sys
import os

# 添加 app 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from app.tools.navigation_tool import NavigationTool


async def test_basic_navigation():
    """测试基本导航功能"""
    print("\n" + "="*60)
    print("测试 1: 基本导航功能")
    print("="*60)
    
    tool = NavigationTool()
    
    # 测试用例 1: 正常导航 (UCSC 格式)
    print("\n📍 Test 1.1: Normal navigation (UCSC format)")
    result = await tool.navigate_to_location("chr1", 1000000, 2000000, genome_format='ucsc')
    assert result["status"] == "success", f"Expected success, got {result['status']}"
    assert result["location"]["chromosome"] == "chr1", "Should use UCSC format"
    assert result["location"]["chromosome_ucsc"] == "chr1"
    assert result["location"]["chromosome_ensembl"] == "1"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 2: 正常导航 (Ensembl 格式)
    print("\n📍 Test 1.2: Normal navigation (Ensembl format)")
    result = await tool.navigate_to_location("1", 1000000, 2000000, genome_format='ensembl')
    assert result["status"] == "success"
    assert result["location"]["chromosome"] == "1", "Should use Ensembl format"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 3: 自动转换格式
    print("\n📍 Test 1.3: Auto format conversion")
    result = await tool.navigate_to_location("1", 1000000, 2000000, genome_format='ucsc')
    assert result["status"] == "success"
    assert result["location"]["chromosome"] == "chr1", "Should convert to UCSC format"
    print(f"✅ PASSED: Converted '1' to 'chr1'")
    
    # 测试用例 4: 无效染色体
    print("\n📍 Test 1.4: Invalid chromosome")
    result = await tool.navigate_to_location("chr99", 1000, 2000)
    assert result["status"] == "error"
    assert result["error_code"] == "INVALID_CHROMOSOME"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 5: 无效起始位置
    print("\n📍 Test 1.5: Invalid start position")
    result = await tool.navigate_to_location("chr1", -100, 2000)
    assert result["status"] == "error"
    assert result["error_code"] == "INVALID_START"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 6: 无效范围
    print("\n📍 Test 1.6: Invalid range (end < start)")
    result = await tool.navigate_to_location("chr1", 2000, 1000)
    assert result["status"] == "error"
    assert result["error_code"] == "INVALID_RANGE"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 7: 自动计算结束位置
    print("\n📍 Test 1.7: Auto-calculated end position")
    result = await tool.navigate_to_location("chr1", 1000000)
    assert result["status"] == "success"
    assert result["location"]["end"] == 1010000
    print(f"✅ PASSED: Auto-calculated end = {result['location']['end']}")
    
    print("\n✅ All basic navigation tests passed!")


async def test_gene_navigation():
    """测试基因名称导航"""
    print("\n" + "="*60)
    print("测试 2: 基因名称导航")
    print("="*60)
    
    tool = NavigationTool()
    
    # 测试用例 1: 已知基因 (BRCA1)
    print("\n🧬 Test 2.1: Known gene (BRCA1)")
    result = await tool.navigate_by_gene("BRCA1", genome_format='ucsc')
    assert result["status"] == "success"
    assert result["location"]["chromosome"] == "chr17"
    assert result["location"]["gene_name"] == "BRCA1"
    assert "BRCA1" in result["message"]
    print(f"✅ PASSED: {result['message']}")
    print(f"   Location: {result['location']['chromosome']}:{result['location']['start']}-{result['location']['end']}")
    
    # 测试用例 2: 已知基因 (TP53)
    print("\n🧬 Test 2.2: Known gene (TP53)")
    result = await tool.navigate_by_gene("TP53")
    assert result["status"] == "success"
    assert result["location"]["chromosome"] == "chr17"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 3: 未知基因
    print("\n🧬 Test 2.3: Unknown gene")
    result = await tool.navigate_by_gene("UNKNOWN_GENE")
    assert result["status"] == "error"
    assert result["error_code"] == "GENE_NOT_FOUND"
    print(f"✅ PASSED: {result['message']}")
    
    # 测试用例 4: 大小写不敏感
    print("\n🧬 Test 2.4: Case insensitive")
    result = await tool.navigate_by_gene("brca1")
    assert result["status"] == "success"
    assert result["location"]["gene_name"] == "brca1"
    print(f"✅ PASSED: Lowercase 'brca1' works")
    
    # 测试用例 5: Ensembl 格式
    print("\n🧬 Test 2.5: Gene navigation with Ensembl format")
    result = await tool.navigate_by_gene("EGFR", genome_format='ensembl')
    assert result["status"] == "success"
    assert result["location"]["chromosome"] == "7"  # Ensembl format
    print(f"✅ PASSED: {result['message']}")
    
    print("\n✅ All gene navigation tests passed!")


async def test_chromosome_formats():
    """测试染色体格式处理"""
    print("\n" + "="*60)
    print("测试 3: 染色体格式处理")
    print("="*60)
    
    tool = NavigationTool()
    
    test_cases = [
        ("chr1", "ucsc", "chr1", "1"),
        ("1", "ucsc", "chr1", "1"),
        ("chr1", "ensembl", "1", "chr1"),
        ("1", "ensembl", "1", "chr1"),
        ("chrX", "ucsc", "chrX", "X"),
        ("X", "ensembl", "X", "chrX"),
        ("chrM", "ucsc", "chrM", "MT"),
        ("MT", "ensembl", "MT", "chrM"),
    ]
    
    for input_chr, format_type, expected_primary, expected_alt in test_cases:
        result = await tool.navigate_to_location(input_chr, 1000000, 2000000, genome_format=format_type)
        assert result["status"] == "success"
        
        if format_type == "ucsc":
            assert result["location"]["chromosome"] == expected_primary
            assert result["location"]["chromosome_ucsc"] == expected_primary
            assert result["location"]["chromosome_ensembl"] == expected_alt
        else:
            assert result["location"]["chromosome"] == expected_primary
            assert result["location"]["chromosome_ensembl"] == expected_primary
            assert result["location"]["chromosome_ucsc"] == expected_alt
        
        print(f"✅ {input_chr} ({format_type}) -> primary: {expected_primary}, alt: {expected_alt}")
    
    print("\n✅ All chromosome format tests passed!")


async def test_navigation_history():
    """测试导航历史"""
    print("\n" + "="*60)
    print("测试 4: 导航历史")
    print("="*60)
    
    tool = NavigationTool()
    
    # 执行几次导航
    await tool.navigate_to_location("chr1", 1000000, 2000000)
    await tool.navigate_to_location("chr2", 3000000, 4000000)
    await tool.navigate_by_gene("BRCA1")
    
    # 获取历史
    history = tool.get_navigation_history()
    assert len(history) == 3, f"Expected 3 history entries, got {len(history)}"
    print(f"✅ Navigation history contains {len(history)} entries")
    
    # 清空历史
    tool.clear_navigation_history()
    history = tool.get_navigation_history()
    assert len(history) == 0, "History should be empty after clear"
    print(f"✅ Navigation history cleared successfully")
    
    print("\n✅ All navigation history tests passed!")


async def main():
    """运行所有测试"""
    print("\n" + "🧪"*30)
    print("NavigationTool 类测试套件")
    print("🧪"*30)
    
    try:
        await test_basic_navigation()
        await test_gene_navigation()
        await test_chromosome_formats()
        await test_navigation_history()
        
        print("\n" + "="*60)
        print("🎉 所有测试通过！")
        print("="*60)
        print("\n✅ Phase 1 完成:")
        print("  - NavigationTool 类实现完成")
        print("  - 染色体标准化集成完成")
        print("  - 基因名称查询支持完成")
        print("  - 参数验证和错误处理完成")
        print("\n下一步: Phase 2 - LangChain 工具集成")
        
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
