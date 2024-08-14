import { NextFunction, Request, Response } from 'express';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import { TokenService } from '../utils/TokenService';

export default class AuthMiddleware {
  tokenService: TokenService;
  constructor() {
    this.tokenService = new TokenService(process.env.JWT_SECRET_KEY ?? 'default_secret_key');
  }
  public async verifyTokenData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Token is required'));
        return;
      }
      const decodedToken = this.tokenService.verifyToken(token);
      if (!decodedToken) {
        res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Token verification failed'));
        return;
      }
      if (decodedToken) {
        req.body.tokenData = decodedToken;
      }

      next();
    } catch (error) {
      res.status(401).json(ResponseFormatter.formatResponse(null, 401, `Token verification failed${error}`));
    }
  }
}
