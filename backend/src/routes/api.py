import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from src.models.soap import SOAPNote, SOAPNoteRequest
from src.models.summary import SummaryRequest
from src.services.extraction_service import extract_soap_note
from src.services.summary_service import generate_summary

router = APIRouter(
    prefix="/api",
)


@router.post("/summary", tags=["Clinical Summary"])
async def get_summary(payload: SummaryRequest):
    """
    Stream summary chunks for the provided dialogue as JSONL.
    """
    dialogue = payload.dialogue

    async def jsonl_generator():
        async for chunk in generate_summary(dialogue):
            yield json.dumps({"delta": chunk}) + "\n"

    return StreamingResponse(jsonl_generator(), media_type="application/x-ndjson")


@router.post("/extract", response_model=SOAPNote, tags=["SOAP Extraction"])
async def extract_soap(payload: SOAPNoteRequest):
    """
    Extract a SOAP note from the provided dialogue.
    """
    text = payload.summary
    soap_note = await extract_soap_note(text)
    return soap_note
