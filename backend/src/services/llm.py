from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

OpenAI_LLM = ChatOpenAI(model="gpt-4o", temperature=0)
