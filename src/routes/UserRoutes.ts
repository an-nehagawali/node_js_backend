import { Router } from 'express';
import MulterConfig from '../config/MulterConfig';
import UserController from '../controllers/UserController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class UserRoutes {
  public router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/add-user',
      MulterConfig.getUploadMiddleware().single('profile_picture'),
      this.userController.addUser.bind(this.userController)
    );
    this.router.post('/login', this.userController.login.bind(this.userController));
    this.router.post(
      '/user-profile',
      this.authMiddleware.verifyTokenData.bind(this.authMiddleware),
      this.userController.getUserProfile.bind(this.userController)
    );
  }
}

export default UserRoutes;
