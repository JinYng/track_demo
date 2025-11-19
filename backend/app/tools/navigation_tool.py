"""
JBrowse 导航工具
提供基因组位置导航功能
"""

from typing import Dict, Any, Optional
import logging
from datetime import datetime

from app.utils.chromosome_normalizer import (
    normalize_chromosome,
    is_valid_chromosome,
    get_chromosome_aliases
)

logger = logging.getLogger(__name__)


class NavigationTool:
    """JBrowse 导航工具类"""
    
    def __init__(self):
        """初始化导航工具"""
        self.navigation_history = []
    
    async def navigate_to_location(
        self,
        chromosome: str,
        start: int,
        end: Optional[int] = None,
        gene_name: Optional[str] = None,
        genome_format: str = 'ucsc'
    ) -> Dict[str, Any]:
        """
        导航到指定基因组位置
        
        Args:
            chromosome: 染色体名称 (如 "chr1", "1", "X")
            start: 起始位置 (bp)
            end: 结束位置 (bp)，可选，默认为 start + 10000
            gene_name: 基因名称，用于显示，可选
            genome_format: 目标基因组格式 ('ucsc' 或 'ensembl')
            
        Returns:
            导航结果字典，包含状态、消息和位置信息
        """
        try:
            logger.info(f"Navigating to: {chromosome}:{start}-{end}")
            
            # 1. 验证染色体名称
            if not is_valid_chromosome(chromosome):
                return {
                    "status": "error",
                    "message": f"Invalid chromosome name: {chromosome}",
                    "error_code": "INVALID_CHROMOSOME",
                    "timestamp": datetime.now().isoformat()
                }
            
            # 2. 验证起始位置
            if start <= 0:
                return {
                    "status": "error",
                    "message": f"Invalid start position: {start}. Must be greater than 0.",
                    "error_code": "INVALID_START",
                    "timestamp": datetime.now().isoformat()
                }
            
            # 3. 设置默认结束位置
            if end is None:
                end = start + 10000
                logger.info(f"End position not specified, using default: {end}")
            
            # 4. 验证结束位置
            if end <= start:
                return {
                    "status": "error",
                    "message": f"End position ({end}) must be greater than start position ({start})",
                    "error_code": "INVALID_RANGE",
                    "timestamp": datetime.now().isoformat()
                }
            
            # 5. 标准化染色体名称 - 提供两种格式
            chromosome_ucsc = normalize_chromosome(chromosome, 'ucsc')
            chromosome_ensembl = normalize_chromosome(chromosome, 'ensembl')
            
            # 根据目标格式选择主要染色体名称
            primary_chromosome = chromosome_ucsc if genome_format == 'ucsc' else chromosome_ensembl
            
            # 6. 构建导航结果
            result = {
                "status": "success",
                "message": f"Successfully prepared navigation to {primary_chromosome}:{start}-{end}",
                "location": {
                    "chromosome": primary_chromosome,
                    "chromosome_ucsc": chromosome_ucsc,
                    "chromosome_ensembl": chromosome_ensembl,
                    "start": start,
                    "end": end,
                    "region_size": end - start
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # 7. 添加基因名称（如果提供）
            if gene_name:
                result["location"]["gene_name"] = gene_name
                result["message"] = f"Successfully prepared navigation to {gene_name} ({primary_chromosome}:{start}-{end})"
            
            # 8. 记录导航历史
            self.navigation_history.append({
                "location": result["location"],
                "timestamp": result["timestamp"]
            })
            
            logger.info(f"Navigation prepared successfully: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error in navigate_to_location: {e}", exc_info=True)
            return {
                "status": "error",
                "message": f"Navigation failed: {str(e)}",
                "error_code": "NAVIGATION_ERROR",
                "timestamp": datetime.now().isoformat()
            }
    
    async def navigate_by_gene(
        self,
        gene_name: str,
        genome_format: str = 'ucsc'
    ) -> Dict[str, Any]:
        """
        通过基因名称导航
        
        Args:
            gene_name: 基因名称 (如 "BRCA1", "TP53")
            genome_format: 目标基因组格式 ('ucsc' 或 'ensembl')
            
        Returns:
            导航结果字典
        """
        try:
            logger.info(f"Navigating by gene: {gene_name}")
            
            # 查询基因信息
            gene_info = await self._query_gene_info(gene_name)
            
            if gene_info is None:
                return {
                    "status": "error",
                    "message": f"Gene not found: {gene_name}",
                    "error_code": "GENE_NOT_FOUND",
                    "timestamp": datetime.now().isoformat()
                }
            
            # 使用基因坐标进行导航
            return await self.navigate_to_location(
                chromosome=gene_info["chromosome"],
                start=gene_info["start"],
                end=gene_info["end"],
                gene_name=gene_name,
                genome_format=genome_format
            )
            
        except Exception as e:
            logger.error(f"Error in navigate_by_gene: {e}", exc_info=True)
            return {
                "status": "error",
                "message": f"Gene navigation failed: {str(e)}",
                "error_code": "GENE_NAVIGATION_ERROR",
                "timestamp": datetime.now().isoformat()
            }
    
    async def _query_gene_info(self, gene_name: str) -> Optional[Dict[str, Any]]:
        """
        查询基因信息
        
        Args:
            gene_name: 基因名称
            
        Returns:
            基因信息字典，如果未找到返回 None
        """
        # TODO: 实现真实的基因数据库查询
        # 目前使用模拟数据
        
        gene_database = {
            "BRCA1": {
                "chromosome": "chr17",
                "start": 43044295,
                "end": 43125483,
                "description": "Breast Cancer 1, Early Onset"
            },
            "BRCA2": {
                "chromosome": "chr13",
                "start": 32315086,
                "end": 32400266,
                "description": "Breast Cancer 2, Early Onset"
            },
            "TP53": {
                "chromosome": "chr17",
                "start": 7661779,
                "end": 7687550,
                "description": "Tumor Protein P53"
            },
            "EGFR": {
                "chromosome": "chr7",
                "start": 55019017,
                "end": 55211628,
                "description": "Epidermal Growth Factor Receptor"
            },
            "MYC": {
                "chromosome": "chr8",
                "start": 127735434,
                "end": 127742951,
                "description": "MYC Proto-Oncogene"
            },
        }
        
        # 大小写不敏感查询
        gene_upper = gene_name.upper()
        
        if gene_upper in gene_database:
            return gene_database[gene_upper]
        
        logger.warning(f"Gene not found in database: {gene_name}")
        return None
    
    def get_navigation_history(self, limit: int = 10) -> list:
        """
        获取导航历史
        
        Args:
            limit: 返回的历史记录数量限制
            
        Returns:
            导航历史列表
        """
        return self.navigation_history[-limit:]
    
    def clear_navigation_history(self):
        """清空导航历史"""
        self.navigation_history.clear()
        logger.info("Navigation history cleared")
