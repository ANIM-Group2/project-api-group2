"""
Retrieves relevant AERONEXIS business context for a given query using semantic search.
"""
import os
import chromadb
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("CHROMA_HOST", "localhost")
port = int(os.getenv("CHROMA_PORT", "8000"))

if host == "localhost":
    _client = chromadb.PersistentClient(path=".chromadb")
else:
    _client = chromadb.HttpClient(host=host, port=port)

_model = SentenceTransformer("all-MiniLM-L6-v2")


def retrieve_context(query: str, n_results: int = 3) -> str:
    try:
        collection = _client.get_collection("aeronexis_kb")
        embedding = _model.encode(query).tolist()
        results = collection.query(
            query_embeddings=[embedding],
            n_results=n_results,
        )
        passages = results["documents"][0]
        return "\n---\n".join(passages)
    except Exception:
        return ""  # RAG is best-effort — agent still works without it
