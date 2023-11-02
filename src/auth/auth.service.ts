import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import * as dotenv from 'dotenv';
import { JwtOptions } from '../jwt/jwt.options';
import { JwtService } from '../jwt/jwt.service';
dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});
  
@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user.rows[0])
    }

    async registration(userDto: CreateUserDto) {
        if (!userDto.email || !userDto.password) {
          throw new HttpException('Prorerty email or password cant be empty', HttpStatus.BAD_REQUEST)
        }
        const candidate = await this.getUserByEmail(userDto.email)
        if (!!candidate) {
            throw new HttpException('User with such email is already exist', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        const client = await pool.connect();

        try {
          await client.query(`
            INSERT INTO users (email, password) VALUES ($1, $2)
          `, [userDto.email, hashPassword]);
          return this.generateToken(userDto)
        } catch (error) {
          console.error("Error inserting user:", error);
        } finally {
          client.release();
        }
    }

    private async getUserByEmail(email: string) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
              SELECT * FROM users WHERE email = $1
            `, [email]);
        
            if (result.rowCount === 0) {
              return false;
            } else {
              return result;
            }
          } catch (error) {
            console.error("Error checking if user exists:", error);
            return false;
          } finally {
            client.release();
          }
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.getUserByEmail(userDto.email)
        if(!user) {
          throw new HttpException('No user with such email', HttpStatus.BAD_REQUEST)
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.rows[0].password)
        if(user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({message: 'Incorrect email or password'})
    }

    private async generateToken(user: CreateUserDto) {
        const candidate = await this.getUserByEmail(user.email)
        const userRows = candidate.rows[0]
        const payload = {id: userRows.id, email: user.email, role: userRows.role}
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
