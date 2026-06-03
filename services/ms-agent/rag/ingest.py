"""
Ingests AERONEXIS business documents into ChromaDB for RAG retrieval.
Run once: python -m rag.ingest
"""
import os
import chromadb
from pathlib import Path
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

def load_docs(docs_dir: str) -> list:
    chunks = []
    for path in Path(docs_dir).glob("*.txt"):
        text = path.read_text(encoding="utf-8")
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        for i, para in enumerate(paragraphs):
            chunks.append({"id": f"{path.stem}_{i}", "text": para, "source": path.name})
    return chunks

def build_vector_store(docs_dir: str = "docs"):
    host = os.getenv("CHROMA_HOST", "localhost")
    port = int(os.getenv("CHROMA_PORT", "8000"))

    if host == "localhost":
        client = chromadb.PersistentClient(path=".chromadb")
    else:
        client = chromadb.HttpClient(host=host, port=port)

    collection = client.get_or_create_collection("aeronexis_kb")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    docs = load_docs(docs_dir)
    print(f"Ingesting {len(docs)} chunks from {docs_dir}/...")

    for doc in docs:
        embedding = model.encode(doc["text"]).tolist()
        collection.add(
            ids=[doc["id"]],
            embeddings=[embedding],
            documents=[doc["text"]],
            metadatas=[{"source": doc["source"]}],
        )

    print(f"Vector store ready: {collection.count()} documents in collection 'aeronexis_kb'.")
    return collection

if __name__ == "__main__":
    build_vector_store()
