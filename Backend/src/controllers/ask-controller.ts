import express, { NextFunction, Request, Response } from "express";
import { gptService } from "../services/gpt-service";

class AskController {

    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/api/ask", this.ask);
    }

private async ask(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
        console.log("ask hit, body:", request.body);
        const question = request.body.question;
        const answer = await gptService.askWithTools(question);
        response.json({ answer });
    }
    catch (err: any) {
        console.log("ASK ERROR:", err.message);
        next(err);
    }
}
}

export const askController = new AskController();