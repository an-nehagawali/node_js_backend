import { Router } from 'express';
import FamousCityPlacesController from '../controllers/FamousCityPlacesController';
class FamouseCityPlacesRoutes {
  public router: Router;
  private famousCityPlacesController: FamousCityPlacesController;

  constructor() {
    this.router = Router();
    this.famousCityPlacesController = new FamousCityPlacesController();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/get-top-city-places', this.famousCityPlacesController.getAllFamousCityPlaces.bind(this.famousCityPlacesController));
    this.router.get('/get-cities-insert', this.famousCityPlacesController.getCitiesByCountryInsert.bind(this.famousCityPlacesController));
    this.router.post(
      '/get-top-cities-by-country',
      this.famousCityPlacesController.getCitiesByCountry.bind(this.famousCityPlacesController)
    );
    this.router.get(
      '/get-city-continent-wise-insert',
      this.famousCityPlacesController.getCitiesContinentWiseInsert.bind(this.famousCityPlacesController)
    );
    this.router.post('/get-city-detail-name', this.famousCityPlacesController.getCityDetailByName.bind(this.famousCityPlacesController));
  }
}
export default FamouseCityPlacesRoutes;
