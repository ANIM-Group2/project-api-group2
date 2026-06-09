# """
# AERONEXIS ms-agent HTTP server
# Exposes the ARIA agent via a REST API for the admin frontend.

# POST /chat
#   Body: { "message": "...", "token": "..." }
#   Returns: { "reply": "...", "timestamp": "..." }

# GET /health
#   Returns: { "status": "ok" }
# """
# import asyncio
# import os
# from datetime import datetime, timezone
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from agent.agent import ConversationAgent

# load_dotenv()

# app = FastAPI(title="ARIA - Aeronexis Intelligence Agent")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3004"],  # admin app only
#     allow_methods=["POST", "GET"],
#     allow_headers=["*"],
# )

# # One agent per session — keyed by token to isolate conversation history
# _agents: dict[str, ConversationAgent] = {}

# MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


# class ChatRequest(BaseModel):
#     message: str
#     token: str  # JWT token from admin session — used as session key


# class ChatResponse(BaseModel):
#     reply: str
#     timestamp: str


# @app.get("/health")
# def health():
#     return {"status": "ok", "model": MODEL}


# @app.post("/chat", response_model=ChatResponse)
# async def chat(req: ChatRequest):
#     if not req.message.strip():
#         raise HTTPException(status_code=400, detail="Empty message")

#     # Get or create agent for this session
#     if req.token not in _agents:
#         _agents[req.token] = ConversationAgent(model=MODEL, verbose=False)

#     # Inject the token into env so MCP server can authenticate
#     os.environ["ADMIN_TOKEN"] = req.token

#     agent = _agents[req.token]
#     reply = await agent.run(req.message)

#     return ChatResponse(
#         reply=reply,
#         timestamp=datetime.now(timezone.utc).isoformat(),
#     )


# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.getenv("AGENT_PORT", "5000"))
#     uvicorn.run("index:app", host="0.0.0.0", port=port, reload=False)





"""
AERONEXIS ms-agent HTTP server
Exposes the ARIA agent via a REST API.

Requests come through the API Gateway which has already verified the JWT.
The gateway forwards the original Authorization header so the MCP server
can use it to authenticate against the other microservices.

POST /chat
  Headers: Authorization: Bearer <token>  (forwarded by gateway)
  Body: { "message": "..." }
  Returns: { "reply": "...", "timestamp": "..." }

GET /health
  Returns: { "status": "ok" }
"""
import asyncio
import os
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from agent.agent import ConversationAgent

load_dotenv()

app = FastAPI(title="ARIA - Aeronexis Intelligence Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3004", "http://localhost:4000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# One agent per session — keyed by token to isolate conversation history
_agents: dict[str, ConversationAgent] = {}

MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


class ChatRequest(BaseModel):
    message: str
    token: str | None = None  # Optional — gateway forwards it in the header


class ChatResponse(BaseModel):
    reply: str
    timestamp: str


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    # Token priority: Authorization header (from gateway) > body token
    auth_header = request.headers.get("authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header else (req.token or "")

    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    # Get or create agent for this session
    if token not in _agents:
        _agents[token] = ConversationAgent(model=MODEL, verbose=False)

    # Inject the token into env so MCP server can authenticate against the gateway
    os.environ["ADMIN_TOKEN"] = token

    agent = _agents[token]
    reply = await agent.run(req.message)

    return ChatResponse(
        reply=reply,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AGENT_PORT", "5000"))
    uvicorn.run("index:app", host="0.0.0.0", port=port, reload=False)