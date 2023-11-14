import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, DbService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registration', () => {
    it('should throw an error if email is already in use', async () => {
      const userDto = new CreateUserDto();
      userDto.email = 'admin';
      userDto.password = 'admin';

      try {
        await authService.registration(userDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User with such email is already exist');
      }
    });

    it('should throw an error if password is not strong enough', async () => {
      const userDto = new CreateUserDto();
      userDto.email = 'test@example.com';
      userDto.password = '123';

      try {
        await authService.registration(userDto);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(error.message).toEqual(
          'Password must be at least 4 characters long',
        );
      }
    });
  });

  describe('login', () => {
    it('should return a token for a valid user', async () => {
      const userDto = new CreateUserDto();
      userDto.email = 'admin';
      userDto.password = 'admin';

      const token = await authService.login(userDto);
      expect(token.access_token).toBeTruthy();
    });

    it('should throw an error if the email is not found', async () => {
      const userDto = new CreateUserDto();
      userDto.email = 'invalid@example.com';
      userDto.password = 'password123';

      try {
        await authService.login(userDto);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual('No user with such email');
      }
    });

    it('should throw an error if the password is incorrect', async () => {
      const userDto = new CreateUserDto();
      userDto.email = 'admin';
      userDto.password = 'neadmin';

      try {
        await authService.login(userDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Incorrect email or password');
      }
    });
  });
});
