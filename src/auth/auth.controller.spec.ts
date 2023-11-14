import { HttpException, HttpStatus } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { JwtService } from '../jwt/jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService(new DbService(), new JwtService());
        authController = new AuthController(authService);
    });

    describe('registration', () => {
        it('should throw an error if email has invalid format', async () => {
            const userDto = new CreateUserDto();
            userDto.email = '';
            userDto.password = 'qwerty123';
        
            try {
              await authController.registration(userDto);
            } catch (error) {
              expect(error).toBeInstanceOf(HttpException);
              expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
              expect(error.message).toEqual('Prorerty email or password cant be empty');
            }
        });

        it('should be defined', () => {
            expect(authController.registration).toBeDefined();
        });
    })  
    
    describe('login', () => {
        it('should call the AuthService registration method', async () => {
            const userDto = new CreateUserDto();
            userDto.email = 'admin';
            userDto.password = 'admin';
          
            const spy = jest.spyOn(authService, 'login');
          
            await authController.login(userDto);
          
            expect(spy).toHaveBeenCalledWith(userDto);
        });

        it('should be defined', () => {
            expect(authController.login).toBeDefined();
        });
    }) 
})
