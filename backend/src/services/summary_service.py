from typing import AsyncGenerator

from langchain_core.prompts import ChatPromptTemplate

from src.core.llm import SummaryLLM
from src.prompts.system import summarization

summary_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", summarization),
        ("user", "{input}"),
    ]
)


async def generate_summary(user_input: str) -> AsyncGenerator[str, None]:
    """
    Asynchronously generate and yield summary chunks for the given user input.
    """
    summary_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", summarization),
            ("user", "{input}"),
        ]
    )
    async for chunk in SummaryLLM.astream(summary_prompt.format(input=user_input)):
        yield chunk.content
