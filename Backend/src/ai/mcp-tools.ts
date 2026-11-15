import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { employeeService } from "../services/EmployeeService";
import { orderService } from "../services/order-service";

class McpTools {
    public async getAllEmployeesTool(): Promise<CallToolResult> {
        console.log("using tool:getAllEmployeesTool");
        const employees = await employeeService.getAllEmployees();
        return {
            content: [{
                type: "text",
                text: JSON.stringify(mcpTools.slimEmployees(employees))
            }]
        };
    }

    public async getAllCountriesTool(): Promise<CallToolResult> {
        console.log("Using tool: getAllCountriesTool");
        const countries = await employeeService.getAllCountries();

        return {
            content: [{
                type: "text",
                text: JSON.stringify(countries)
            }]
        };
    }
    public async getAllCitiesTool(): Promise<CallToolResult> {
        console.log("Using tool: getAllCitiesTool");
        const cities = await employeeService.getAllCities();

        return {
            content: [{
                type: "text",
                text: JSON.stringify(cities)
            }]
        };
    }
    public async getOneOrderTool(args: { id: number }): Promise<CallToolResult> {
        console.log("Using tool: getOneOrderTool");
        const order = await orderService.getOneOrder(args.id);
        return {
            content: [{
                type: "text",
                text: JSON.stringify(order || { error: `order ${args.id} not found` })
            }]
        };
    }

    public async getOrderCountByEmployeeTool(): Promise<CallToolResult> {
        console.log("Using tool: getOrderCountByEmployeeTool");
        const counts = await orderService.getOrderCountByEmployee();
        return {
            content: [{
                type: "text",
                text: JSON.stringify(counts)
            }]
        };
    }

    // Keeps only the useful fields, so the payload stays small:
    private slimEmployees(employees: any[]): any[] {
        return employees.map(e => ({
            id: e.employeeId,
            fullName: e.firstName + " " + e.lastName,
            title: e.title,
            city: e.city,
            country: e.country
        }));
    }
}

export const mcpTools = new McpTools();