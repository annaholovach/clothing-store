import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'
dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

@Injectable()
export class OrdersService {

    async getAll() {
        const client = await pool.connect()
        try {
            const query = `
                SELECT o.id, o.userId, o.totalPrice, o.createdAt, 
                json_agg(jsonb_build_object('cloth_id', c.id, 'title', c.title, 'amount', co.amount)) AS items
                FROM orders o
                LEFT JOIN cloth_order co ON o.id = co.order_id
                LEFT JOIN clothing c ON co.cloth_id = c.id
                GROUP BY o.id, o.userId, o.totalPrice, o.createdAt;
            `;
            const result = await client.query(query)
            return result.rows
          } finally {
            client.release();
          }
    }

    async getOne(id: number) {
        const client = await pool.connect()
        try {
            const query = `
                SELECT o.id, o.userId, o.totalPrice, o.createdAt, 
                json_agg(jsonb_build_object('cloth_id', c.id, 'title', c.title, 'amount', co.amount)) AS items
                FROM orders o
                LEFT JOIN cloth_order co ON o.id = co.order_id
                LEFT JOIN clothing c ON co.cloth_id = c.id
                WHERE o.id = $1
                GROUP BY o.id, o.userId, o.totalPrice, o.createdAt;
            `
            const values = [id]
            const result = await client.query(query, values)
      
            if (result.rows.length > 0) {
              return result.rows[0]
            } else {
              throw new HttpException('not foud order with such id', HttpStatus.BAD_REQUEST)
            }
        } finally {
            client.release();
        }
    }

    async create (dto: CreateOrderDto) {
        const client = await pool.connect()
        try {
            const countItems = dto.items.length
            const totalPrice = await this.countTotalPrice(dto.items)

            const insertOrderQuery = `
            INSERT INTO orders (userId, items, totalprice)
            VALUES ($1, $2, $3)
            RETURNING id;
            `;
            const orderValues = [dto.userId, countItems, totalPrice];
            const orderResult = await client.query(insertOrderQuery, orderValues);
      
            const orderId = orderResult.rows[0].id;

            for (const item of dto.items) {
            
                const insertClothOrderQuery = `
                INSERT INTO cloth_order (cloth_id, order_id, amount)
                VALUES ($1, $2, $3);
                `;
                const clothOrderValues = [item.cloth_id, orderId, item.amount];
                await client.query(insertClothOrderQuery, clothOrderValues);
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
            const result = await client.query(selectOrderQuery, selectOrderValues);
      
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    private async getPrice(id: number) {
        const client = await pool.connect();
        try {
            const query = 'SELECT price FROM clothing WHERE id = $1';
            const values = [id];
            const result = await client.query(query, values);

            if (result.rows.length > 0) {
            const pricePerUnit = result.rows[0].price;
            return pricePerUnit;
            } else {
                throw new HttpException('not foud clothing with such id', HttpStatus.BAD_REQUEST)
            }
        } finally {
            client.release();
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
