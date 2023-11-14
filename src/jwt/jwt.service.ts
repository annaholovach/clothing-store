import { Injectable } from '@nestjs/common';
import { JwtOptions } from './jwt.options';
import * as crypto from 'crypto';

@Injectable()
export class JwtService {
  sign(payload: object, secret: string, options?: JwtOptions): string {
    const now = Math.floor(Date.now() / 1000);
    const iat = now;
    const exp = now + (options?.expiresIn || 3600);

    const updatedPayload = {
      ...payload,
      iat,
      exp,
    };

    const payloadString = JSON.stringify(updatedPayload);
    const encodedPayload = this.base64UrlEncode(payloadString);

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const headerString = JSON.stringify(header);
    const encodedHeader = this.base64UrlEncode(headerString);
    const signature = this.createSignature(
      encodedHeader + '.' + encodedPayload,
      secret,
    );
    const encodedSignature = this.base64UrlEncode(signature);

    const signedToken = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    return signedToken;
  }

  verify(token: string, secret: string) {
    const [headerBase64, payloadBase64, signature] = token.split('.');

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

    const dataToSign = headerBase64 + '.' + payloadBase64;
    const calculatedSignature = this.createSignature(dataToSign, secret);
    const decodedSignature = this.base64UrlDecode(signature);

    if (decodedSignature !== calculatedSignature) {
      throw new Error('Invalid token signature');
    }
    return payload;
  }

  private base64UrlEncode(str) {
    const base64 = Buffer.from(str).toString('base64');
    const base64Url = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64Url;
  }

  private createSignature(data, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    return hmac.digest('base64');
  }

  private base64UrlDecode(str) {
    while (str.length % 4 !== 0) {
      str += '=';
    }

    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString();
  }
}
