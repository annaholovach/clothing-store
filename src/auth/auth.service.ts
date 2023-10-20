import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import * as dotenv from 'dotenv';
import { JwtOptions } from './jwt.options';
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

    async getUserByEmail(email: string) {
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
        const payload = {email: user.email}
        const secret = process.env.SECRET_KEY
        const options: JwtOptions = {
          expiresIn: 7200,
          secret: process.env.SECRET_KEY
        }
        console.log(options);
        
        const token = this.sign(payload, secret, options)
        return {
            access_token: token
        }
    }

    private sign(payload: object, secret: string, options?: JwtOptions): string {

      const now = Math.floor(Date.now() / 1000);
      const iat = now;
      const exp = now + (options?.expiresIn || 3600)

      const updatedPayload = {
        ...payload,
        iat,
        exp
      };

      const payloadString = JSON.stringify(updatedPayload);
      const encodedPayload = this.base64UrlEncode(payloadString);
 
      const header = {
          alg: "HS256",
          typ: "JWT"
      };

      const headerString = JSON.stringify(header);
      const encodedHeader = this.base64UrlEncode(headerString);
      const signature = this.createSignature(encodedHeader + "." + encodedPayload, secret);
      const encodedSignature = this.base64UrlEncode(signature)
      const signedToken = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
      return signedToken
    }

    private base64UrlEncode(str) {
      let base64 = Buffer.from(str).toString("base64");
      let base64Url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
      return base64Url;
    }

    private createSignature(data, secret) {
      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(data);
      return hmac.digest("base64");
    }
}
