import { JwtService } from '../jwt/jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService(new JwtService());
        authController = new AuthController(authService);
    });

    describe('registration', () => {
        // it('should call the AuthService registration method', async () => {
        //     const userDto = new CreateUserDto();
        //     userDto.email = 'new';
        //     userDto.password = 'newnew';
          
        //     const spy = jest.spyOn(authService, 'registration');
          
        //     await authController.registration(userDto);
          
        //     expect(spy).toHaveBeenCalledWith(userDto);
        // });

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
