import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { DbService } from '../db/db.service';
dotenv.config();

@Injectable()
export class OrdersService {

    constructor(private readonly databaseService: DbService,
                private usersSevice: UsersService) {}

    async getAll() {
        const query = `
                SELECT o.id, o.userId, o.totalPrice, o.createdAt, 
                json_agg(jsonb_build_object('cloth_id', c.id, 'title', c.title, 'amount', co.amount)) AS items
                FROM orders o
                LEFT JOIN cloth_order co ON o.id = co.order_id
                LEFT JOIN clothing c ON co.cloth_id = c.id
                GROUP BY o.id, o.userId, o.totalPrice, o.createdAt;
            `;
        const result = await this.databaseService.executeQuery(query)
        return result
    }

    async getOne(id: number) {
        const query = `
            SELECT o.id, o.userId, o.totalPrice, o.createdAt, 
            json_agg(jsonb_build_object('cloth_id', c.id, 'title', c.title, 'amount', co.amount)) AS items
            FROM orders o
            LEFT JOIN cloth_order co ON o.id = co.order_id
            LEFT JOIN clothing c ON co.cloth_id = c.id
            WHERE o.id = $1
            GROUP BY o.id, o.userId, o.totalPrice, o.createdAt;
        `
        const param = [id]
        const result = await this.databaseService.executeQuery(query, param)
        if (result.length === 0) {
            throw new HttpException('order with this id does not exist', HttpStatus.NOT_FOUND)
        }
        return result[0]
    }

    async create (dto: CreateOrderDto) {
        const user = await this.usersSevice.getOne(dto.userId)
        if (!user) {
            throw new HttpException('user does not exist', HttpStatus.NOT_FOUND)
        }
        const countItems = dto.items.length
        const totalPrice = await this.countTotalPrice(dto.items)
        const insertOrderQuery = `
        INSERT INTO orders (userId, items, totalprice)
        VALUES ($1, $2, $3)
        RETURNING id;
        `;
        const orderValues = [dto.userId, countItems, totalPrice];
        const orderResult = await this.databaseService.executeQuery(insertOrderQuery, orderValues);
      
        const orderId = orderResult[0].id;

        for (const item of dto.items) {
            
            const insertClothOrderQuery = `
            INSERT INTO cloth_order (cloth_id, order_id, amount)
            VALUES ($1, $2, $3);
            `;
            const clothOrderValues = [item.cloth_id, orderId, item.amount];
            await this.databaseService.executeQuery(insertClothOrderQuery, clothOrderValues);
        }
      
        const selectOrderQuery = `
            SELECT o.id AS order_id, o.userId, 
                json_agg(jsonb_build_object('clothId', c.id, 'title', c.title, 'price', c.price, 'amount', co.amount)) AS items,
                o.totalPrice, o.createdAt
            FROM orders o
            JOIN cloth_order co ON o.id = co.order_id
            JOIN clothing c ON co.cloth_id = c.id
            WHERE o.id = $1
            GROUP BY o.id, o.userId, o.totalPrice, o.createdAt;
        `;
        const selectOrderValues = [orderId];
        const result = await this.databaseService.executeQuery(selectOrderQuery, selectOrderValues);
      
        return result[0];
    }

    private async getPrice(id: number) {
        const query = 'SELECT price FROM clothing WHERE id = $1';
        const params = [id];
        const result = await this.databaseService.executeQuery(query, params)
        if (result.length > 0) {
            const pricePerUnit = result[0].price;
            return pricePerUnit;
        } else {
            throw new HttpException('not foud clothing with such id', HttpStatus.NOT_FOUND)
        }
    }

    private async countTotalPrice (items) {
        let totalPrice = 0
            for (const item of items) {
                const getPrice = await this.getPrice(item.cloth_id)
                const countPrice = getPrice * item.amount 
                totalPrice += countPrice
            }
        return totalPrice
    }
}
