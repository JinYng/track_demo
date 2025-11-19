"""
染色体名称标准化工具
处理不同的染色体命名约定（chr1 vs 1）
"""

import re
from typing import Literal, List, Optional

# 染色体别名映射
CHROMOSOME_ALIASES = {
    # 常染色体 1-22
    '1': ['chr1', '1'],
    '2': ['chr2', '2'],
    '3': ['chr3', '3'],
    '4': ['chr4', '4'],
    '5': ['chr5', '5'],
    '6': ['chr6', '6'],
    '7': ['chr7', '7'],
    '8': ['chr8', '8'],
    '9': ['chr9', '9'],
    '10': ['chr10', '10'],
    '11': ['chr11', '11'],
    '12': ['chr12', '12'],
    '13': ['chr13', '13'],
    '14': ['chr14', '14'],
    '15': ['chr15', '15'],
    '16': ['chr16', '16'],
    '17': ['chr17', '17'],
    '18': ['chr18', '18'],
    '19': ['chr19', '19'],
    '20': ['chr20', '20'],
    '21': ['chr21', '21'],
    '22': ['chr22', '22'],
    
    # 性染色体
    'X': ['chrX', 'X'],
    'Y': ['chrY', 'Y'],
    
    # 线粒体
    'M': ['chrM', 'M', 'MT', 'chrMT'],
    'MT': ['chrM', 'M', 'MT', 'chrMT'],
}


def normalize_chromosome(
    chromosome: str,
    format: Literal['ucsc', 'ensembl'] = 'ucsc'
) -> str:
    """
    标准化染色体名称
    
    Args:
        chromosome: 输入的染色体名称
        format: 目标格式 ('ucsc' = 带chr前缀, 'ensembl' = 不带chr前缀)
    
    Returns:
        标准化后的染色体名称
    """
    # 移除空格并转大写
    cleaned = chromosome.strip().upper()
    
    # 移除 chr 前缀用于查找
    without_chr = re.sub(r'^CHR', '', cleaned, flags=re.IGNORECASE)
    
    # 在别名映射中查找
    for key, aliases in CHROMOSOME_ALIASES.items():
        aliases_upper = [a.upper() for a in aliases]
        if cleaned in aliases_upper or without_chr in aliases_upper:
            # 根据目标格式返回
            if format == 'ucsc':
                # UCSC 格式: chr1, chr2, chrX, chrM
                if key in ('M', 'MT'):
                    return 'chrM'
                return f'chr{key}'
            else:
                # Ensembl 格式: 1, 2, X, MT
                if key == 'M':
                    return 'MT'
                return key
    
    # 如果没找到，返回原始输入（可能是非标准染色体）
    return chromosome


def is_valid_chromosome(chromosome: str) -> bool:
    """
    验证染色体名称是否有效
    
    Args:
        chromosome: 染色体名称
    
    Returns:
        是否有效
    """
    cleaned = chromosome.strip().upper()
    without_chr = re.sub(r'^CHR', '', cleaned, flags=re.IGNORECASE)
    
    # 检查是否在别名映射中
    for aliases in CHROMOSOME_ALIASES.values():
        aliases_upper = [a.upper() for a in aliases]
        if cleaned in aliases_upper or without_chr in aliases_upper:
            return True
    
    return False


def get_chromosome_aliases(chromosome: str) -> List[str]:
    """
    获取染色体的所有别名
    
    Args:
        chromosome: 染色体名称
    
    Returns:
        所有别名数组
    """
    cleaned = chromosome.strip().upper()
    without_chr = re.sub(r'^CHR', '', cleaned, flags=re.IGNORECASE)
    
    for aliases in CHROMOSOME_ALIASES.values():
        aliases_upper = [a.upper() for a in aliases]
        if cleaned in aliases_upper or without_chr in aliases_upper:
            return aliases
    
    return [chromosome]


def detect_chromosome_format(chromosome: str) -> Literal['ucsc', 'ensembl']:
    """
    检测染色体名称使用的格式
    
    Args:
        chromosome: 染色体名称
    
    Returns:
        'ucsc' 或 'ensembl'
    """
    if chromosome.lower().startswith('chr'):
        return 'ucsc'
    else:
        return 'ensembl'


def smart_normalize_chromosome(
    chromosome: str,
    target_format: Optional[Literal['ucsc', 'ensembl']] = None
) -> str:
    """
    智能标准化染色体名称
    如果未指定目标格式，保持原格式
    
    Args:
        chromosome: 输入的染色体名称
        target_format: 目标格式，如果为 None 则保持原格式
    
    Returns:
        标准化后的染色体名称
    """
    if target_format is None:
        target_format = detect_chromosome_format(chromosome)
    
    return normalize_chromosome(chromosome, target_format)
