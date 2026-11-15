import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register.js";

class NorthwindMcpServer {
    public create(): McpServer {

        // Create mcp server:
        const mcpServer = new McpServer({
            name: "northwind-mcp-server",
            version: "1.0.0"
        });

        mcpRegister.registerGetAllEmployeesTool(mcpServer);
        mcpRegister.registerGetAllCountriesTool(mcpServer);
        mcpRegister.registerGetAllCitiesTool(mcpServer);
        mcpRegister.registerGetOneOrderTool(mcpServer);
        mcpRegister.registerGetOrderCountByEmployeeTool(mcpServer);

        console.log("Tools registered: 5");
        return mcpServer;
    }
}
export const northwindMcpServer = new NorthwindMcpServer();