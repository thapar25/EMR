from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

SummaryLLM = ChatOpenAI(
    name="Summarization", model="gpt-4o", temperature=0.2, tags=["summarization", "API"]
)

ExtractionLLM = ChatOpenAI(
    name="Extraction", model="gpt-4o", temperature=0.0, tags=["extraction", "API"]
)
