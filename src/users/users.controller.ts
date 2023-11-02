import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor (private usersService: UsersService) {}

    @Get()
    getAll() {
        return this.usersService.getAll()
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.usersService.getOne(id)
    }
}
