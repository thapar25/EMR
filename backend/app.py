from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from src.routes import api

app = FastAPI()


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


app.include_router(api.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", reload=True)
