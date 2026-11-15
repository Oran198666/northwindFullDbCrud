import axios from "axios";
import { appConfig } from "../utils/app-config";
import { mcpClient } from "../ai/McpClient";

class GptService {

    public async getCompletion(systemPrompt: string, userPrompt: string): Promise<string> {

        const body = {
            model: appConfig.openaiModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0
        };

        const response = await axios.post(appConfig.openaiUrl, body, this.options());
        return response.data.choices[0].message.content;
    }

    public async askWithTools(question: string): Promise<string> {
        console.log("askWithTools called:", question);
        const tools = (await mcpClient.listTools()).map(t => ({
            type: "function",
            function: {
                name: t.name,
                description: t.description,
                parameters: t.inputSchema
            }
        }));

        const messages: any[] = [
            {
                role: "system",
                content: "You answer questions about the Northwind database using the provided tools. Call as many tools as you need. Base your answer only on tool results."
            },
            { role: "user", content: question }
        ];

        for (let i = 0; i < 5; i++) {

            const body = {
                model: appConfig.openaiModel,
                messages,
                tools
            };

            let response;
            try {
                response = await axios.post(appConfig.openaiUrl, body, this.options());
            }
            catch (err: any) {
                console.log("OPENAI ERROR:", JSON.stringify(err.response?.data, null, 2));
                throw err;
            }

            const message = response.data.choices[0].message;

            messages.push(message);

            if (!message.tool_calls) return message.content;

            for (const call of message.tool_calls) {
                const args = JSON.parse(call.function.arguments || "{}");
                const result = await mcpClient.callTool(call.function.name, args);
                messages.push({
                    role: "tool",
                    tool_call_id: call.id,
                    content: result
                });
            }
        }

        return "Could not answer within the tool call limit.";
    }

    private options() {
        return {
            headers: {
                authorization: "Bearer " + appConfig.openaiApiKey
            }
        };
    }
}

export const gptService = new GptService();