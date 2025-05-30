from fastapi import FastAPI, UploadFile, File
from .utils import extract_text_from_pdf
from .vector_store import VectorStore
from .rag import RAGBot

app = FastAPI()
vstore = VectorStore()
bot = RAGBot(vstore)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    with open(f"temp.pdf", "wb") as f:
        f.write(contents)
    text = extract_text_from_pdf("temp.pdf")
    vstore.add_documents([text])
    return {"status": "Document indexed"}

@app.get("/ask")
def ask(question: str):
    answer = bot.answer_question(question)
    return {"answer": answer}