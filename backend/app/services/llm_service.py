"""
LLM Service using LangChain
"""

from typing import Optional, List, Dict, Any
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.schema import BaseMessage, HumanMessage, SystemMessage
from langchain.callbacks.manager import CallbackManagerForLLMRun

from app.core.config import settings


class LLMService:
    """Service for interacting with Large Language Models"""
    
    def __init__(self):
        self.chat_model = ChatOpenAI(
            model_name=settings.DEFAULT_LLM_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.1,
        )
    
    async def analyze_genomics_query(
        self, 
        query: str, 
        context: Optional[str] = None
    ) -> str:
        """
        Analyze a genomics-related query using LLM
        
        Args:
            query: User's genomics question
            context: Additional context from knowledge base
            
        Returns:
            LLM response
        """
        system_prompt = """
        You are an expert genomics analyst assistant. You help researchers analyze 
        genomic data and answer questions about genetics, genomics, and bioinformatics.
        
        Provide accurate, scientific responses based on current genomics knowledge.
        If you're unsure about something, clearly state the limitations.
        """
        
        messages = [SystemMessage(content=system_prompt)]
        
        if context:
            messages.append(SystemMessage(content=f"Additional context: {context}"))
        
        messages.append(HumanMessage(content=query))
        
        response = await self.chat_model.agenerate([messages])
        return response.generations[0][0].text
    
    async def explain_variant(
        self, 
        variant_info: Dict[str, Any]
    ) -> str:
        """
        Explain a genetic variant using LLM
        
        Args:
            variant_info: Dictionary containing variant information
            
        Returns:
            Explanation of the variant
        """
        query = f"""
        Please explain this genetic variant:
        
        Chromosome: {variant_info.get('chromosome', 'Unknown')}
        Position: {variant_info.get('position', 'Unknown')}
        Reference: {variant_info.get('ref', 'Unknown')}
        Alternative: {variant_info.get('alt', 'Unknown')}
        Gene: {variant_info.get('gene', 'Unknown')}
        
        Provide information about:
        1. What this variant means
        2. Potential functional impact
        3. Clinical significance (if known)
        4. Population frequency (if available)
        """
        
        return await self.analyze_genomics_query(query)


# Global instance
llm_service = LLMService()