import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { DbModule } from 'src/db/db.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
      JwtModule, 
      DbModule
    ],
    exports: [
        AuthService,
        JwtModule
  ]
})
export class AuthModule {}
