import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv';
import { JwtOptions } from '../jwt/jwt.options';
import { JwtService } from '../jwt/jwt.service';
import {DbService} from '../db/db.service'
dotenv.config();
  
@Injectable()
export class AuthService {

  constructor(private readonly databaseService: DbService, 
              private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user[0])
    }

    async registration(userDto: CreateUserDto) {
        if (!userDto.email || !userDto.password) {
          throw new HttpException('Prorerty email or password cant be empty', HttpStatus.BAD_REQUEST)
        }
        if (userDto.password.length < 4) {
          throw new HttpException('Password must be at least 4 characters long', HttpStatus.BAD_REQUEST)
        }
        const candidate = await this.getUserByEmail(userDto.email)
        if (candidate) {
            throw new HttpException('User with such email is already exist', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)

        const query = `INSERT INTO users (email, password) VALUES ($1, $2)`
        const params = [userDto.email, hashPassword]
        await this.databaseService.executeQuery(query, params)
        return this.generateToken(userDto)
    }

    private async getUserByEmail(email: string) {
        const query = `SELECT id, email, password, role FROM users WHERE email = $1`
        const params = [email]
        const result = await this.databaseService.executeQuery(query, params)
        if (result.length === 0) {
          return null;
        }
        return result;
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.getUserByEmail(userDto.email)
        if(!user) {
          throw new HttpException('No user with such email', HttpStatus.NOT_FOUND)
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user[0].password)
        if(user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({message: 'Incorrect email or password'})
    }

    private async generateToken(user: CreateUserDto) {
        const candidate = await this.getUserByEmail(user.email)
        const payload = {id: candidate[0].id, email: user.email, role: candidate[0].role}
        const secret = process.env.SECRET_KEY
        
        const options: JwtOptions = {
          expiresIn: 7200,
          secret: process.env.SECRET_KEY
        }
    
        const token = this.jwtService.sign(payload, secret, options)
        return {
            access_token: token
        }
    }
}
