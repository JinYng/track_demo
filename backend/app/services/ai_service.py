from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from typing import Dict, Any, List, Optional
from fastapi import WebSocket
import logging
from datetime import datetime
import json
import uuid

from app.tools.jbrowse_tools import JBrowseToolkit
from app.tools.jbrowse_langchain_tools import JBROWSE_TOOLS
from app.tools.navigation_tool import NavigationTool

logger = logging.getLogger(__name__)

class AIService:
    """AI服务核心类"""
    
    def __init__(self):
        self.jbrowse_toolkit = JBrowseToolkit()
        self.navigation_tool = NavigationTool()
        self.tools = JBROWSE_TOOLS
        self.system_prompt = self._create_system_prompt()
    
    def _create_system_prompt(self) -> str:
        """创建系统提示词"""
        return """你是一个专业的基因组学分析助手，具备以下能力：

1. 基因组数据分析和解释
2. JBrowse 2 基因组浏览器控制
3. 基因信息查询和注释
4. 生物学概念解释

可用工具：
- navigate_jbrowse: 导航到指定基因组位置（染色体:起始-结束）
- navigate_to_gene: 通过基因名称导航到基因位置
- get_navigation_history: 查看最近的导航历史

当用户想要查看特定基因组区域或基因时，请使用相应的导航工具。
工具会自动处理不同的染色体命名格式（chr1 vs 1）。

请用专业但易懂的语言回答用户的基因组学问题，并在需要时调用相应的工具来辅助分析。"""
    
    async def process_query(
        self, 
        query: str, 
        ai_model_config: Dict[str, Any],
        websocket: Optional[WebSocket] = None
    ) -> Dict[str, Any]:
        """处理AI查询（带工具调用支持）"""
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
            
            # 创建LangChain ChatOpenAI实例并绑定工具
            llm = ChatOpenAI(
                base_url=api_base_url,
                api_key=api_key,
                model=model_name,
                temperature=0.1
            )
            
            # 绑定工具到 LLM
            llm_with_tools = llm.bind_tools(self.tools)
            
            # 准备消息
            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=query)
            ]
            
            # 调用AI模型
            response = await llm_with_tools.ainvoke(messages)
            
            # 检查是否有工具调用
            tool_calls = getattr(response, 'tool_calls', [])
            tool_results = []
            
            if tool_calls:
                logger.info(f"LLM requested {len(tool_calls)} tool calls")
                
                # 执行所有工具调用
                for tool_call in tool_calls:
                    tool_name = tool_call.get('name')
                    tool_args = tool_call.get('args', {})
                    
                    logger.info(f"Executing tool: {tool_name} with args: {tool_args}")
                    
                    # 查找并执行工具
                    tool_result = await self._execute_langchain_tool(tool_name, tool_args)
                    tool_results.append({
                        "tool": tool_name,
                        "args": tool_args,
                        "result": tool_result
                    })
                    
                    # 如果是导航工具，发送导航指令到前端
                    if websocket and tool_name in ['navigate_jbrowse', 'navigate_to_gene']:
                        await self._send_navigation_command(websocket, tool_name, tool_args, tool_result)
                
                # 构建工具结果摘要
                tool_results_text = "\n\n".join([
                    f"Tool: {tr['tool']}\nResult: {tr['result']}"
                    for tr in tool_results
                ])
                
                # 将工具结果添加到消息历史
                messages.append(AIMessage(content=response.content))
                messages.append(HumanMessage(content=f"Tool execution results:\n{tool_results_text}\n\nPlease provide a final response to the user based on these results."))
                
                # 再次调用 LLM 生成最终回复
                final_response = await llm.ainvoke(messages)
                response_content = final_response.content
            else:
                response_content = response.content
            
            return {
                "content": response_content,
                "timestamp": datetime.now(),
                "tool_results": tool_results,
                "model_used": model_name,
                "tool_calls_made": len(tool_calls)
            }
            
        except Exception as e:
            logger.error(f"Error processing AI query: {e}", exc_info=True)
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
    
    async def _execute_langchain_tool(self, tool_name: str, tool_args: Dict[str, Any]) -> str:
        """执行 LangChain 工具"""
        try:
            # 查找工具
            tool_func = None
            for tool in self.tools:
                if tool.name == tool_name:
                    tool_func = tool
                    break
            
            if tool_func is None:
                return f"Error: Tool '{tool_name}' not found"
            
            # 执行工具（支持异步和同步）
            if hasattr(tool_func, 'ainvoke'):
                result = await tool_func.ainvoke(tool_args)
            else:
                result = tool_func.invoke(tool_args)
            
            return str(result)
            
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}", exc_info=True)
            return f"Error executing tool: {str(e)}"
    
    async def _send_navigation_command(
        self,
        websocket: WebSocket,
        tool_name: str,
        tool_args: Dict[str, Any],
        tool_result: str
    ):
        """发送导航指令到前端"""
        try:
            # 检查工具是否成功执行
            if "failed" in tool_result.lower() or "error" in tool_result.lower():
                logger.warning(f"Tool execution failed, not sending navigation command: {tool_result}")
                return
            
            # 根据工具类型构建导航指令
            if tool_name == 'navigate_jbrowse':
                # 直接使用工具参数
                navigation_data = await self.navigation_tool.navigate_to_location(
                    chromosome=tool_args.get('chromosome'),
                    start=tool_args.get('start'),
                    end=tool_args.get('end'),
                    genome_format=tool_args.get('genome_format', 'ucsc')
                )
            elif tool_name == 'navigate_to_gene':
                # 通过基因名称获取位置
                navigation_data = await self.navigation_tool.navigate_by_gene(
                    gene_name=tool_args.get('gene_name'),
                    genome_format=tool_args.get('genome_format', 'ucsc')
                )
            else:
                return
            
            # 检查导航数据是否成功
            if navigation_data.get('status') != 'success':
                logger.warning(f"Navigation data preparation failed: {navigation_data}")
                return
            
            # 构建 WebSocket 消息
            request_id = str(uuid.uuid4())
            location = navigation_data['location']
            
            navigation_command = {
                "type": "navigation",
                "action": "navigate_to_location",
                "payload": {
                    "chromosome": location['chromosome'],
                    "chromosome_ucsc": location['chromosome_ucsc'],
                    "chromosome_ensembl": location['chromosome_ensembl'],
                    "start": location['start'],
                    "end": location['end'],
                    "gene_name": location.get('gene_name')
                },
                "requestId": request_id,
                "timestamp": datetime.now().isoformat()
            }
            
            # 发送导航指令
            await websocket.send_text(json.dumps(navigation_command))
            logger.info(f"Sent navigation command: {request_id}")
            
        except Exception as e:
            logger.error(f"Error sending navigation command: {e}", exc_info=True)