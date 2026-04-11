#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mcpServer } from "../lib/mcp.js";

async function main() {
  console.error("Starting AyuraHealth MCP Server...");
  
  // Create an stdio transport for communication with the MCP Client (like Cursor or Claude)
  const transport = new StdioServerTransport();
  
  // Connect the MCP server to the transport
  await mcpServer.connect(transport);
  
  console.error("✅ AyuraHealth MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start AyuraHealth MCP Server:", error);
  process.exit(1);
});
