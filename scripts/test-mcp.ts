import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

async function main() {
  console.log("Connecting to AyuraHealth Stdio MCP Server...");
  
  // Standard way an MCP Client (like Cursor) connects via shell execution
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", path.resolve(process.cwd(), "mcp-server", "index.ts")],
  });
  
  const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
  
  await client.connect(transport);
  console.log("✅ Connected Successfully!");

  // List tools
  const toolsResponse = await client.listTools();
  console.log("\n🛠️  Available Tools:");
  toolsResponse.tools.forEach(t => console.log(`  - ${t.name}: ${t.description}`));

  // Test calculate_dosha tool
  console.log("\n🧪 Testing Tool: calculate_dosha");
  const result = await client.callTool({
    name: "calculate_dosha",
    arguments: {
      symptoms: ["anxiety", "cold hands", "dry skin", "irregular digestion"],
      bodyType: "thin",
      digestion: "irregular"
    }
  });
  
  if (Array.isArray(result.content) && result.content[0]?.type === "text") {
    console.log(JSON.parse(result.content[0].text));
  } else {
    console.log(result);
  }

  // Cleanup
  console.log("\nClosing connection...");
  await transport.close();
  process.exit(0);
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
