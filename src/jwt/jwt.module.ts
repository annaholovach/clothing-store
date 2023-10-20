import { Module } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';

@Module({
    controllers: [],
    providers: [JwtService],
    imports: [],
    exports: [
        JwtService
  ]
})
export class JwtModule {}