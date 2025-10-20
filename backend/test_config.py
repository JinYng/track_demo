#!/usr/bin/env python3
"""
配置测试脚本
验证Settings类是否正确加载.env文件中的配置
"""

import sys
import os

# 添加app目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

try:
    from app.core.config import settings
    
    print("=" * 50)
    print("配置加载测试")
    print("=" * 50)
    
    print(f"应用名称: {settings.APP_NAME}")
    print(f"版本: {settings.VERSION}")
    print(f"调试模式: {settings.DEBUG}")
    
    print("\n--- Groq 配置 ---")
    print(f"API Base URL: {settings.GROQ_API_BASE_URL}")
    print(f"API Key: {settings.GROQ_API_KEY[:10]}..." if settings.GROQ_API_KEY else "API Key: 未设置")
    print(f"模型名称: {settings.GROQ_MODEL_NAME}")
    
    print("\n--- ModelScope 配置 ---")
    print(f"API Base URL: {settings.MODELSCOPE_API_BASE_URL}")
    print(f"API Key: {settings.MODELSCOPE_API_KEY[:10]}..." if settings.MODELSCOPE_API_KEY else "API Key: 未设置")
    print(f"模型名称: {settings.MODELSCOPE_MODEL_NAME}")
    
    print("\n--- 其他配置 ---")
    print(f"JBrowse配置路径: {settings.JBROWSE_CONFIG_PATH}")
    print(f"日志级别: {settings.LOG_LEVEL}")
    print(f"允许的来源: {settings.ALLOWED_ORIGINS}")
    
    print("\n" + "=" * 50)
    print("配置加载成功!")
    
except Exception as e:
    print(f"配置加载失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)