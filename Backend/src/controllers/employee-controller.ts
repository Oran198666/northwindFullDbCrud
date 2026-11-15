import express, { NextFunction, Request, Response } from "express";
import { employeeService } from "../services/EmployeeService";

class EmployeeController {

    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get("/api/employees", this.getAllEmployees);
        this.router.get("/api/employees/:id", this.getOneEmployee);
    }

    private async getAllEmployees(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const employees = await employeeService.getAllEmployees();
            response.json(employees);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async getOneEmployee(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            const employee = await employeeService.getOneEmployee(id);
            response.json(employee);
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const employeeController = new EmployeeController();