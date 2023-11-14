import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Roles(['admin', 'moderator'])
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(RolesGuard)
  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.ordersService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
