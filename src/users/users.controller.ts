import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeRoleDto } from './dto/change.role.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {

    constructor (private usersService: UsersService) {}

    @Roles(['admin'])
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.usersService.getAll()
    }

    @Roles(['admin'])
    @UseGuards(RolesGuard)
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.usersService.getOne(id)
    }

    @Roles(['admin'])
    @UseGuards(RolesGuard)
    @Put('/role') 
    changeRole(@Body() dto: ChangeRoleDto) {
        return this.usersService.changeRole(dto)
    }
}
