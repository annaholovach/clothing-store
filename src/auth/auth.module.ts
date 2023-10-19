import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '2h'
            }
        })
    ],
    exports: [
        AuthService,
        JwtModule,
  ]
})
export class AuthModule {}
