import jwt from 'jsonwebtoken';

interface TokenPayload {
  [key: string]: any;
}

export class TokenService {
  private secretKey: string;
  private expiresIn: string;

  constructor(secretKey: string, expiresIn: string = '1h') {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  public generateToken(payload: TokenPayload): string {
    try {
      const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
      return token;
    } catch (error) {
      console.error('Error generating token', error);
      throw error;
    }
  }

  public verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Error verifying token', error);
      return null;
    }
  }
}
