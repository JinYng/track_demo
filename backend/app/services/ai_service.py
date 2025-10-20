from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from typing import Dict, Any, List
import logging
from datetime import datetime

from app.tools.jbrowse_tools import JBrowseToolkit

logger = logging.getLogger(__name__)

class AIService:
    """AI服务核心类"""
    
    def __init__(self):
        self.jbrowse_toolkit = JBrowseToolkit()
        self.system_prompt = self._create_system_prompt()
    
    def _create_system_prompt(self) -> str:
        """创建系统提示词"""
        return """你是一个专业的基因组学分析助手，具备以下能力：

1. 基因组数据分析和解释
2. JBrowse 2 基因组浏览器控制
3. 基因信息查询和注释
4. 生物学概念解释

可用工具：
- navigate_to_locus: 导航到指定基因位点
- get_gene_info: 获取基因详细信息
- search_variants: 搜索遗传变异
- explain_genomic_region: 解释基因组区域功能

请用专业但易懂的语言回答用户的基因组学问题，并在需要时调用相应的工具来辅助分析。"""
    
    async def process_query(self, query: str, ai_model_config: Dict[str, Any]) -> Dict[str, Any]:
        """处理AI查询"""
        try:
            logger.info(f"Processing query: {query[:100]}...")
            
            # 提取模型配置
            api_base_url = ai_model_config.get("apiBaseUrl", "https://api.openai.com/v1")
            api_key = ai_model_config.get("apiKey", "")
            model_name = ai_model_config.get("modelName", "gpt-4")
            
            # 快速测试模式 - 如果API Key是"test-key"，返回模拟响应
            if api_key == "test-key":
                return await self._generate_test_response(query, model_name)
            
            if not api_key:
                return {
                    "content": "请先在模型配置中设置API Key，或使用'test-key'进行测试。",
                    "timestamp": datetime.now(),
                    "error": "missing_api_key"
                }
            
            # 创建LangChain ChatOpenAI实例
            llm = ChatOpenAI(
                base_url=api_base_url,
                api_key=api_key,
                model=model_name,
                temperature=0.1
            )
            
            # 准备消息
            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=query)
            ]
            
            # 调用AI模型
            response = await llm.ainvoke(messages)
            
            # 检查是否需要调用工具
            tool_actions = self._extract_tool_actions(response.content)
            
            # 执行工具操作
            tool_results = []
            for action in tool_actions:
                result = await self._execute_tool_action(action)
                tool_results.append(result)
            
            return {
                "content": response.content,
                "timestamp": datetime.now(),
                "tool_results": tool_results,
                "model_used": model_name
            }
            
        except Exception as e:
            logger.error(f"Error processing AI query: {e}")
            return {
                "content": f"处理查询时出现错误: {str(e)}",
                "timestamp": datetime.now(),
                "error": str(e)
            }
    
    async def _generate_test_response(self, query: str, model_name: str) -> Dict[str, Any]:
        """生成测试响应（快速模式）"""
        import asyncio
        
        # 模拟少量延迟
        await asyncio.sleep(0.1)
        
        # 基于查询内容生成相应的测试响应
        query_lower = query.lower()
        
        if "基因组" in query or "genomics" in query_lower:
            content = """基因组学是研究生物体完整DNA序列（基因组）的学科。它包括：

1. **结构基因组学**: 研究基因组的物理结构和组织
2. **功能基因组学**: 研究基因功能和基因间相互作用
3. **比较基因组学**: 比较不同物种的基因组

现代基因组学技术如高通量测序、CRISPR基因编辑等正在革命性地改变生物医学研究。"""

        elif "brca1" in query_lower or "brca" in query_lower:
            content = """BRCA1基因信息：

**基本信息:**
- 位置: 染色体17q21.31
- 全名: Breast Cancer 1, Early Onset
- 功能: DNA修复、肿瘤抑制

**临床意义:**
- BRCA1突变与遗传性乳腺癌和卵巢癌风险增加相关
- 携带者终生患乳腺癌风险可达70%
- 重要的遗传咨询和筛查目标

**JBrowse导航:** 可以导航到chr17:43,044,295-43,125,483查看详细结构。"""

        elif "dna" in query_lower or "序列" in query:
            content = """DNA序列分析是基因组学的核心技术：

**主要分析类型:**
1. **序列比对**: 将测序reads比对到参考基因组
2. **变异检测**: 识别SNP、InDel、结构变异
3. **注释分析**: 预测基因功能和影响

**常用工具:**
- BWA/Bowtie2: 序列比对
- GATK: 变异检测
- SnpEff/VEP: 变异注释

**质量控制:** 包括测序质量评估、覆盖度分析、污染检测等。"""

        else:
            content = f"""感谢您的问题："{query}"

作为AI基因组学助手，我可以帮助您：

1. **基因信息查询**: 提供基因位置、功能、疾病关联等信息
2. **JBrowse控制**: 导航到特定基因组位置，显示轨道数据
3. **变异分析**: 解释遗传变异的生物学意义
4. **概念解释**: 解释基因组学相关概念和技术

请告诉我您想了解的具体基因或基因组学概念，我会为您提供详细的专业解答。"""

        return {
            "content": content,
            "timestamp": datetime.now(),
            "tool_results": [],
            "model_used": f"{model_name} (测试模式)",
            "test_mode": True
        }
    
    def _extract_tool_actions(self, response_content: str) -> List[Dict[str, Any]]:
        """从AI响应中提取工具调用"""
        # 这里可以实现更复杂的工具调用解析逻辑
        # 目前返回空列表，后续可以扩展
        return []
    
    async def _execute_tool_action(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """执行工具操作"""
        tool_name = action.get("tool")
        params = action.get("params", {})
        
        try:
            if tool_name == "navigate_to_locus":
                return await self.jbrowse_toolkit.navigate_to_locus(**params)
            elif tool_name == "get_gene_info":
                return await self.jbrowse_toolkit.get_gene_info(**params)
            elif tool_name == "search_variants":
                return await self.jbrowse_toolkit.search_variants(**params)
            else:
                return {"error": f"Unknown tool: {tool_name}"}
                
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return {"error": str(e)}