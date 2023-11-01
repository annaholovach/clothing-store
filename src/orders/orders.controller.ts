import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';

@Controller('orders')
export class OrdersController {

    constructor (private ordersService: OrdersService) {}

    @Get()
    getAll() {
        return this.ordersService.getAll()
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.ordersService.getOne(id)
    }

    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.create(dto)
    }
}
