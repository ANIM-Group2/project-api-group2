"""
ARIA - Aeronexis Real-time Intelligence Assistant
Orchestrator agent: ReAct loop with Ollama + MCP tools + RAG context.
"""
import asyncio
import os
import argparse
import ollama
from pathlib import Path
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from rag.retriever import retrieve_context
from dotenv import load_dotenv

load_dotenv()


class ConversationAgent:
    def __init__(self, model: str = "llama3.2", verbose: bool = False):
        self.model   = model
        self.verbose = verbose
        self.client  = ollama.Client(host=os.getenv("OLLAMA_HOST", "http://localhost:11434"))

        prompt_path = Path(__file__).parent / "prompts" / "system.md"
        system_prompt = prompt_path.read_text(encoding="utf-8")

        # Conversation history is maintained across turns (stateful chat)
        self.messages = [{"role": "system", "content": system_prompt}]

    async def _get_mcp_session(self, stack):
        params = StdioServerParameters(
            command="python",
            args=["-m", "mcp_server.server"],
        )
        transport = await stack.enter_async_context(stdio_client(params))
        read, write = transport
        session = await stack.enter_async_context(ClientSession(read, write))
        await session.initialize()
        return session

    def _mcp_tools_to_ollama(self, mcp_tools) -> list:
        return [
            {
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description,
                    "parameters": t.inputSchema,
                },
            }
            for t in mcp_tools
        ]

    async def run(self, user_query: str) -> str:
        async with AsyncExitStack() as stack:
            session = await self._get_mcp_session(stack)
            tools_response = await session.list_tools()
            tools = self._mcp_tools_to_ollama(tools_response.tools)

            if self.verbose:
                print(f"[MCP] {len(tools)} tools available: {[t['function']['name'] for t in tools]}")

            # RAG: inject relevant business context
            context = retrieve_context(user_query)
            user_content = user_query
            if context:
                user_content = f"Context from knowledge base:\n{context}\n\nQuestion: {user_query}"

            self.messages.append({"role": "user", "content": user_content})

            # ReAct loop (max 5 iterations)
            for iteration in range(5):
                response = self.client.chat(
                    model=self.model,
                    messages=self.messages,
                    tools=tools,
                )
                msg = response.message

                if not msg.tool_calls:
                    # Final answer — no tool needed
                    self.messages.append({"role": "assistant", "content": msg.content})
                    return msg.content

                if self.verbose:
                    print(f"\n[ReAct] Iteration {iteration + 1} — tool calls: {[tc.function.name for tc in msg.tool_calls]}")

                # Add assistant message with tool_calls
                self.messages.append({
                    "role": "assistant",
                    "content": "",
                    "tool_calls": [
                        {
                            "function": {
                                "name": tc.function.name,
                                "arguments": dict(tc.function.arguments),
                            }
                        }
                        for tc in msg.tool_calls
                    ],
                })

                # Execute each tool call via MCP
                for tc in msg.tool_calls:
                    print(f"[MCP] Calling: {tc.function.name}({dict(tc.function.arguments)})")
                    tool_result = await session.call_tool(
                        tc.function.name,
                        arguments=dict(tc.function.arguments),
                    )
                    content = tool_result.content[0].text if tool_result.content else "{}"
                    self.messages.append({
                        "role": "tool",
                        "name": tc.function.name,
                        "content": content,
                    })

            return "Loop limit reached — unable to complete the analysis."


async def main():
    parser = argparse.ArgumentParser(description="ARIA - AERONEXIS Intelligence Assistant")
    parser.add_argument("--model", default="llama3.2", help="Ollama model name")
    parser.add_argument("-v", "--verbose", action="store_true", help="Show ReAct loop details")
    args = parser.parse_args()

    agent = ConversationAgent(model=args.model, verbose=args.verbose)
    print(f"ARIA ready (model: {args.model}). Type 'quit' to exit.\n")

    while True:
        try:
            query = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            break
        if query.lower() in ("quit", "exit", "q"):
            break
        if not query:
            continue
        answer = await agent.run(query)
        print(f"\nARIA: {answer}\n")


if __name__ == "__main__":
    asyncio.run(main())
