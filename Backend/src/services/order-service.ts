import { OrderModel } from "../models/order-model";
import { dal } from "../utils/dal";

class OrderService {

    public async getAllOrders(): Promise<OrderModel[]> {
        const sql = "select * from orders";
        const orders = await dal.execute(sql) as OrderModel[];
        return orders;
    }

    public async getOneOrder(id: number): Promise<OrderModel> {
        const sql = "select * from orders where id = ?";
        const values = [id];
        const orders = await dal.execute(sql, values) as OrderModel[];
        const order = orders[0];
        return order;
    }

    public async getOrdersByYear(year: number): Promise<OrderModel[]> {
        const sql = "select * from orders where year(orderDate) = ?";
        const values = [year];
        const orders = await dal.execute(sql, values) as OrderModel[];
        return orders;
    }

    public async getTotalFreightByYear(year: number): Promise<number> {
        const sql = "select sum(freight) as total from orders where year(orderDate) = ?";
        const values = [year];
        const result = await dal.execute(sql, values) as any[];
        return result[0].total;
    }

    public async getOrderCountByEmployee(): Promise<any[]> {
        const sql = `
        SELECT e.id AS employeeId,
               CONCAT(e.firstName, ' ', e.lastName) AS fullName,
               COUNT(o.id) AS orderCount
        FROM employees e
        LEFT JOIN orders o ON o.employeeId = e.id
        GROUP BY e.id, e.firstName, e.lastName
        ORDER BY orderCount DESC
    `;
        return await dal.execute(sql) as any[];
    }
}

export const orderService = new OrderService();