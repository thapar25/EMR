from pydantic import BaseModel


class SummaryRequest(BaseModel):
    dialogue: str
