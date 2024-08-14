import { Router } from 'express';
import ContinentController from '../controllers/ContinentController';

class ContinentRoutes {
  public router: Router;
  private continentController: ContinentController;

  constructor() {
    this.router = Router();
    this.continentController = new ContinentController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/add-continent', this.continentController.addContinent.bind(this.continentController));
    this.router.get('/', this.continentController.getAllContinents.bind(this.continentController));
    this.router.get('/:id', this.continentController.getContinentById.bind(this.continentController));
    this.router.put('/update/:id', this.continentController.updateContinent.bind(this.continentController));
    this.router.get('/country/get-all-data', this.continentController.getAllData.bind(this.continentController));
  }
}

export default ContinentRoutes;
