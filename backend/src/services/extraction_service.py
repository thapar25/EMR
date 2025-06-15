from langchain_core.prompts import ChatPromptTemplate

from src.core.llm import ExtractionLLM
from src.models.soap import SOAPNote
from src.prompts.system import extraction


async def extract_soap_note(user_input: str) -> SOAPNote:
    """
    Asynchronously extract and return a SOAPNote object from the given user input.
    """
    extraction_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", extraction),
            ("user", "{input}"),
        ]
    )
    llm_with_structured_output = ExtractionLLM.with_structured_output(schema=SOAPNote)
    response = await llm_with_structured_output.ainvoke(
        extraction_prompt.format(input=user_input)
    )
    return response
