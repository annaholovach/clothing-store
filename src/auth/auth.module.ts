import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';

@Module({
    controllers: [AuthController],
    providers: [
      AuthService,
      DbService
    ],
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
