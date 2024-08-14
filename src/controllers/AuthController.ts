import { Request, Response } from 'express';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import { TokenService } from '../utils/TokenService';

export class AuthController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService(process.env.JWT_SECRET_KEY ?? 'default_secret_key');
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await this.authenticateUser(username, password);

      if (user) {
        const payload = { userId: user.id, username: user.username };
        const token = this.tokenService.generateToken(payload);

        res.json(ResponseFormatter.formatResponse({ token }, 200, 'Login successful'));
      } else {
        res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Invalid credentials'));
      }
    } catch (error) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to login', error));
    }
  }
}
