"""
测试 LangChain 工具集成
"""

import asyncio
import sys
import os

# 添加 app 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from app.tools.jbrowse_langchain_tools import (
    navigate_jbrowse,
    navigate_to_gene,
    get_navigation_history,
    JBROWSE_TOOLS
)


async def test_navigate_jbrowse_tool():
    """测试 navigate_jbrowse 工具"""
    print("\n" + "="*60)
    print("测试 1: navigate_jbrowse 工具")
    print("="*60)
    
    # 测试用例 1: 正常导航
    print("\n📍 Test 1.1: Normal navigation")
    result = await navigate_jbrowse.ainvoke({
        "chromosome": "chr1",
        "start": 1000000,
        "end": 2000000
    })
    print(f"Result: {result}")
    assert "Successfully navigated" in result
    print("✅ PASSED")
    
    # 测试用例 2: 自动计算结束位置
    print("\n📍 Test 1.2: Auto-calculated end position")
    result = await navigate_jbrowse.ainvoke({
        "chromosome": "chr1",
        "start": 1000000
    })
    print(f"Result: {result}")
    assert "Successfully navigated" in result
    print("✅ PASSED")
    
    # 测试用例 3: 无效染色体
    print("\n📍 Test 1.3: Invalid chromosome")
    result = await navigate_jbrowse.ainvoke({
        "chromosome": "chr99",
        "start": 1000000
    })
    print(f"Result: {result}")
    assert "failed" in result.lower()
    print("✅ PASSED")
    
    print("\n✅ All navigate_jbrowse tests passed!")


async def test_navigate_to_gene_tool():
    """测试 navigate_to_gene 工具"""
    print("\n" + "="*60)
    print("测试 2: navigate_to_gene 工具")
    print("="*60)
    
    # 测试用例 1: 已知基因
    print("\n🧬 Test 2.1: Known gene (BRCA1)")
    result = await navigate_to_gene.ainvoke({
        "gene_name": "BRCA1"
    })
    print(f"Result: {result}")
    assert "Successfully navigated" in result
    assert "BRCA1" in result
    print("✅ PASSED")
    
    # 测试用例 2: 未知基因
    print("\n🧬 Test 2.2: Unknown gene")
    result = await navigate_to_gene.ainvoke({
        "gene_name": "UNKNOWN_GENE"
    })
    print(f"Result: {result}")
    assert "failed" in result.lower()
    print("✅ PASSED")
    
    print("\n✅ All navigate_to_gene tests passed!")


async def test_navigation_history_tool():
    """测试 get_navigation_history 工具"""
    print("\n" + "="*60)
    print("测试 3: get_navigation_history 工具")
    print("="*60)
    
    # 先执行几次导航
    await navigate_jbrowse.ainvoke({"chromosome": "chr1", "start": 1000000, "end": 2000000})
    await navigate_jbrowse.ainvoke({"chromosome": "chr2", "start": 3000000, "end": 4000000})
    await navigate_to_gene.ainvoke({"gene_name": "BRCA1"})
    
    # 获取历史
    print("\n📜 Test 3.1: Get navigation history")
    result = get_navigation_history.invoke({"limit": 5})
    print(f"Result:\n{result}")
    assert "Recent navigation history" in result or "chr" in result.lower()
    print("✅ PASSED")
    
    print("\n✅ All navigation history tests passed!")


def test_tool_metadata():
    """测试工具元数据"""
    print("\n" + "="*60)
    print("测试 4: 工具元数据")
    print("="*60)
    
    print(f"\n📋 Total tools: {len(JBROWSE_TOOLS)}")
    
    for tool in JBROWSE_TOOLS:
        print(f"\n🔧 Tool: {tool.name}")
        print(f"   Description: {tool.description[:100]}...")
        
        # 验证工具有必要的属性
        assert hasattr(tool, 'name'), f"Tool {tool} missing 'name' attribute"
        assert hasattr(tool, 'description'), f"Tool {tool} missing 'description' attribute"
        assert tool.description, f"Tool {tool.name} has empty description"
        
        print(f"   ✅ Metadata valid")
    
    print("\n✅ All tool metadata tests passed!")


async def test_tool_invocation_methods():
    """测试工具调用方法"""
    print("\n" + "="*60)
    print("测试 5: 工具调用方法")
    print("="*60)
    
    # 测试 ainvoke (异步)
    print("\n⚡ Test 5.1: Async invocation (ainvoke)")
    result = await navigate_jbrowse.ainvoke({
        "chromosome": "chr1",
        "start": 1000000
    })
    assert isinstance(result, str)
    print("✅ PASSED: ainvoke works")
    
    # 测试 invoke (同步)
    print("\n⚡ Test 5.2: Sync invocation (invoke)")
    result = get_navigation_history.invoke({"limit": 3})
    assert isinstance(result, str)
    print("✅ PASSED: invoke works")
    
    print("\n✅ All invocation method tests passed!")


async def main():
    """运行所有测试"""
    print("\n" + "🧪"*30)
    print("LangChain 工具集成测试套件")
    print("🧪"*30)
    
    try:
        await test_navigate_jbrowse_tool()
        await test_navigate_to_gene_tool()
        await test_navigation_history_tool()
        test_tool_metadata()
        await test_tool_invocation_methods()
        
        print("\n" + "="*60)
        print("🎉 所有测试通过！")
        print("="*60)
        print("\n✅ Phase 2 完成:")
        print("  - LangChain 工具定义完成")
        print("  - 工具可以被 LLM 调用")
        print("  - 工具元数据正确")
        print("  - 异步和同步调用都支持")
        print("\n下一步: 集成到 AI Service 并测试完整流程")
        
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
