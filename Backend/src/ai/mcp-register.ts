import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";
import z from "zod";

class McpRegister {

    public registerGetAllEmployeesTool(mcpServer: McpServer): void {
        const uniqueName = "get_all_employees";
        const config = {
            description: "Get all employees, each with id, full name, job title, city and country."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAllEmployeesTool);
    }

    public registerGetAllCountriesTool(mcpServer: McpServer): void {
        const uniqueName = "get_all_countries";
        const config = {
            description: "Get all countries in the database."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAllCountriesTool);
    }

    public registerGetAllCitiesTool(mcpServer: McpServer): void {
        const uniqueName = "get_all_cities";
        const config = {
            description: "Get all cities in the database, each with its country."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAllCitiesTool);
    }

    public registerGetOneOrderTool(mcpServer: McpServer): void {
        const uniqueName = "get_one_order";
        const config = {
            description: "Get a single order by its id, including the id of the employee who handled it.",
            inputSchema: { id: z.number() }
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getOneOrderTool);
    }

    public registerGetOrderCountByEmployeeTool(mcpServer: McpServer): void {
        const uniqueName = "get_order_count_by_employee";
        const config = {
            description: "Get every employee with the total number of orders they handled, sorted from most to least."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getOrderCountByEmployeeTool);
    }
}

export const mcpRegister = new McpRegister();