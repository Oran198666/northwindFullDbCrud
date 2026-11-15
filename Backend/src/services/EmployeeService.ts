import { dal } from "../utils/dal";
import { EmployeeModel } from "../models/EmployeeModel";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";

class EmployeeService {

    public async getAllEmployees(): Promise<EmployeeModel[]> {
        const sql = `
            SELECT e.id AS employeeId, e.firstName, e.lastName, e.title,
                   c.name AS city,
                   co.name AS country
            FROM employees e
            LEFT JOIN cities c ON e.cityId = c.id
            LEFT JOIN countries co ON c.countryId = co.id
            ORDER BY e.id
        `;
        const employees = await dal.execute(sql) as EmployeeModel[];
        return employees;
    }

    public async getOneEmployee(id: number): Promise<EmployeeModel> {
        const sql = `
            SELECT e.id AS employeeId, e.firstName, e.lastName, e.title,
                   c.name AS city,
                   co.name AS country
            FROM employees e
            LEFT JOIN cities c ON e.cityId = c.id
            LEFT JOIN countries co ON c.countryId = co.id
            WHERE e.id = ?
        `;
        const employees = await dal.execute(sql, [id]) as EmployeeModel[];
        const employee = employees[0];
        if (!employee) throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        return employee;
    }

    public async getAllCountries(): Promise<{ id: number, name: string }[]> {
        const sql = `SELECT id, name FROM countries ORDER BY name`;
        const countries = await dal.execute(sql) as { id: number, name: string }[];
        return countries;
    }

    public async getAllCities(): Promise<{ id: number, name: string, country: string }[]> {
        const sql = `
            SELECT c.id, c.name, co.name AS country
            FROM cities c
            LEFT JOIN countries co ON c.countryId = co.id
            ORDER BY c.name
        `;
        const cities = await dal.execute(sql) as { id: number, name: string, country: string }[];
        return cities;
    }
}

export const employeeService = new EmployeeService();