import { Router } from 'express';
import TestController from '../controllers/TestController';

class TestRoutes {
  public router: Router;
  private testController: TestController;
  constructor() {
    this.router = Router();
    this.testController = new TestController();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/', this.testController.getAllContinents.bind(this.testController));
  }
}
export default TestRoutes;
