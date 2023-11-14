export type JwtOptions = {
  algorithm?: string;
  expiresIn?: number;
  issuer?: string;
  subject?: string;
  audience?: string;
  notBefore?: Date;
  expiresOn?: Date;
  claims?: any;
  secret: string;
};
