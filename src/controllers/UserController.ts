import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { EmailService } from '../utils/EmailService';
import { PasswordUtils } from '../utils/PasswordUtils';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import { TokenService } from '../utils/TokenService';
import { UserValidator } from '../validators/UserValidator';

class UserController {
  private userModel: UserModel;
  private userValidator: UserValidator;
  private emailService: EmailService;
  private tokenService: TokenService;

  constructor() {
    this.userModel = new UserModel();
    this.userValidator = new UserValidator();
    this.emailService = new EmailService();
    this.tokenService = new TokenService(process.env.JWT_SECRET_KEY ?? 'default_secret_key');
  }
  public async addUser(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { error } = this.userValidator.validate(req.body);
      if (error) {
        res.status(400).json(ResponseFormatter.formatResponse(null, 400, error.details[0].message));
        return;
      }
      const { password, confirmEmail, verifyPassword, ...rest } = req.body;
      const hashedPassword = await PasswordUtils.hashPassword(password);
      const insertData = {
        ...rest,
        password: hashedPassword,
        profile_picture: file?.path,
      };
      // check email already exists or not
      const isEmailExists = await this.userModel.findByEmail(insertData.email);
      if (isEmailExists) {
        res.status(400).json(ResponseFormatter.formatResponse(null, 400, 'Email already exists'));
        return;
      }
      const isInserted = await this.userModel.create(insertData);
      if (isInserted) {
        // send email to user
        const templateData = {
          subject: 'Signup successfully',
          body: 'Welcome to Pangea',
          name: insertData.name,
        };

        await this.emailService.sendEmail(insertData.email, 'Welcome to Our Service', 'signup_email_template.html', templateData);
        //generate jwt token
        const payload = { username: insertData.username, email: insertData.email };
        const token = this.tokenService.generateToken(payload);
        if (!token) {
          res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to generate token'));
          return;
        }
        res.status(201).json(ResponseFormatter.formatResponse({ token: token }, 201, 'User added successfully'));
      } else {
        res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to add user'));
      }
    } catch (error) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to add user.', error));
      return;
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      if (token) {
        // Token is provided
        const decodedToken = this.tokenService.verifyToken(token);
        const expiresIn = decodedToken?.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (expiresIn && expiresIn < currentTimestamp) {
          res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Token expired'));
        }
        const user = await this.userModel.findByEmail(decodedToken?.email);
        if (user) {
          const isPasswordMatched = await PasswordUtils.comparePassword(req.body.password, user.password);
          if (isPasswordMatched && user.username === decodedToken?.username) {
            res.status(200).json(ResponseFormatter.formatResponse({ token: token }, 200, 'Login Successful'));
          } else {
            res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Invalid credentials'));
          }
        } else {
          res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'User not found'));
        }
      } else {
        // Token is not provided
        const user = await this.userModel.findByUsername(req.body.username);
        if (user) {
          const isPasswordMatched = await PasswordUtils.comparePassword(req.body.password, user.password);
          if (isPasswordMatched) {
            const payload = { username: user.username, email: user.email };
            const token = this.tokenService.generateToken(payload);

            if (token) {
              res.status(200).json(ResponseFormatter.formatResponse({ token: token }, 200, 'Login Successful'));
            } else {
              res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to generate token'));
            }
          } else {
            res.status(401).json(ResponseFormatter.formatResponse(null, 401, 'Invalid credentials'));
          }
        } else {
          res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'User not found'));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, `Internal server error:${error}`));
    }
  }

  public async getUserProfile(req: Request, res: Response): Promise<void> {
    const tokenData = req.body.tokenData;
    if (tokenData) {
      const user = await this.userModel.findByEmail(tokenData.email);
      if (!user) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'User not found'));
        return;
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(user, 200, 'User profile fetched successfully'));
      }
    }
  }
}
export default UserController;
