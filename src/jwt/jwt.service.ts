import { Injectable } from "@nestjs/common";
import { JwtOptions } from "./jwt.options";

@Injectable()
export class JwtService {
    sign(payload: object, secret: string, options?: JwtOptions): string {

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