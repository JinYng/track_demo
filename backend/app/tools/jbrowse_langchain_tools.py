"""
JBrowse LangChain 工具定义
将 NavigationTool 封装为 LangChain 可调用的工具
"""

from typing import Optional
from langchain.tools import tool
import logging

from app.tools.navigation_tool import NavigationTool

logger = logging.getLogger(__name__)

# 创建全局 NavigationTool 实例
_navigation_tool = NavigationTool()


@tool
async def navigate_jbrowse(
    chromosome: str,
    start: int,
    end: Optional[int] = None,
    genome_format: str = "ucsc"
) -> str:
    """
    Navigate JBrowse genome browser to a specific genomic location.
    
    Use this tool when the user wants to view a specific region of the genome.
    The tool accepts chromosome names in various formats (chr1, 1, chrX, X, etc.)
    and automatically normalizes them to match the genome assembly format.
    
    Args:
        chromosome: Chromosome name (e.g., "chr1", "1", "X", "chrX")
        start: Start position in base pairs (must be positive integer)
        end: End position in base pairs (optional, defaults to start + 10000)
        genome_format: Target genome format, either "ucsc" (chr1) or "ensembl" (1)
    
    Returns:
        A message indicating the navigation result
    
    Examples:
        - navigate_jbrowse("chr1", 1000000, 2000000) -> Navigate to chr1:1000000-2000000
        - navigate_jbrowse("X", 5000000) -> Navigate to chrX:5000000-5010000
        - navigate_jbrowse("17", 43044295, 43125483, "ensembl") -> Navigate to 17:43044295-43125483
    """
    try:
        result = await _navigation_tool.navigate_to_location(
            chromosome=chromosome,
            start=start,
            end=end,
            genome_format=genome_format
        )
        
        if result["status"] == "success":
            location = result["location"]
            return (
                f"Successfully navigated to {location['chromosome']}:{location['start']}-{location['end']}. "
                f"Region size: {location['region_size']:,} bp. "
                f"The genome browser view has been updated."
            )
        else:
            return f"Navigation failed: {result['message']}"
            
    except Exception as e:
        logger.error(f"Error in navigate_jbrowse tool: {e}", exc_info=True)
        return f"Navigation error: {str(e)}"


@tool
async def navigate_to_gene(
    gene_name: str,
    genome_format: str = "ucsc"
) -> str:
    """
    Navigate JBrowse genome browser to a specific gene location.
    
    Use this tool when the user wants to view a gene by its name.
    The tool will look up the gene's genomic coordinates and navigate to that location.
    
    Args:
        gene_name: Gene symbol (e.g., "BRCA1", "TP53", "EGFR")
        genome_format: Target genome format, either "ucsc" (chr1) or "ensembl" (1)
    
    Returns:
        A message indicating the navigation result
    
    Examples:
        - navigate_to_gene("BRCA1") -> Navigate to BRCA1 gene location
        - navigate_to_gene("TP53", "ensembl") -> Navigate to TP53 in Ensembl format
    """
    try:
        result = await _navigation_tool.navigate_by_gene(
            gene_name=gene_name,
            genome_format=genome_format
        )
        
        if result["status"] == "success":
            location = result["location"]
            return (
                f"Successfully navigated to {gene_name} gene at "
                f"{location['chromosome']}:{location['start']}-{location['end']}. "
                f"Gene region size: {location['region_size']:,} bp. "
                f"The genome browser view has been updated."
            )
        else:
            return f"Gene navigation failed: {result['message']}"
            
    except Exception as e:
        logger.error(f"Error in navigate_to_gene tool: {e}", exc_info=True)
        return f"Gene navigation error: {str(e)}"


@tool
def get_navigation_history(limit: int = 5) -> str:
    """
    Get the recent navigation history.
    
    Use this tool when the user asks about previous locations they viewed
    or wants to go back to a previous location.
    
    Args:
        limit: Maximum number of history entries to return (default: 5)
    
    Returns:
        A formatted string with navigation history
    
    Examples:
        - get_navigation_history() -> Returns last 5 navigation locations
        - get_navigation_history(10) -> Returns last 10 navigation locations
    """
    try:
        history = _navigation_tool.get_navigation_history(limit=limit)
        
        if not history:
            return "No navigation history available."
        
        history_lines = ["Recent navigation history:"]
        for i, entry in enumerate(reversed(history), 1):
            location = entry["location"]
            timestamp = entry["timestamp"]
            gene_info = f" ({location.get('gene_name')})" if location.get('gene_name') else ""
            history_lines.append(
                f"{i}. {location['chromosome']}:{location['start']}-{location['end']}{gene_info} "
                f"at {timestamp}"
            )
        
        return "\n".join(history_lines)
        
    except Exception as e:
        logger.error(f"Error in get_navigation_history tool: {e}", exc_info=True)
        return f"Error retrieving navigation history: {str(e)}"


# 导出所有工具
JBROWSE_TOOLS = [
    navigate_jbrowse,
    navigate_to_gene,
    get_navigation_history,
]
