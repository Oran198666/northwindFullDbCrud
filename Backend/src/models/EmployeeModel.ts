import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Employee Schema:
const EmployeeSchema = z.object({
    employeeId: z.number().int().positive().optional(),
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(50),
    title: z.string().min(2).max(100),
    city: z.string().min(2).max(50),
    country: z.string().min(2).max(50)
});

// Employee Interface:
type IEmployeeModel = z.infer<typeof EmployeeSchema>;

// Employee Model:
export class EmployeeModel implements IEmployeeModel {

    public employeeId: number;
    public firstName: string;
    public lastName: string;
    public title: string;
    public city: string;
    public country: string;

    public constructor(employee: EmployeeModel) {
        this.employeeId = employee.employeeId;
        this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.title = employee.title;
        this.city = employee.city;
        this.country = employee.country;
    }

    public validate(): void {
        const result = EmployeeSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}