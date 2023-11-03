import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [JwtModule],
    exports: [
        AuthService,
        JwtModule
  ]
})
export class AuthModule {}
