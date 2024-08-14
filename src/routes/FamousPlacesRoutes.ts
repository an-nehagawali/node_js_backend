import { Router } from 'express';
import FamousPlacesController from '../controllers/FamousPlacesController';
class FamousPlacesRoutes {
  public router: Router;
  private famousPlacesController: FamousPlacesController;

  constructor() {
    this.router = Router();
    this.famousPlacesController = new FamousPlacesController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get('/get-all-famous-places', this.famousPlacesController.getAllFamousPlaces.bind(this.famousPlacesController));
    this.router.get('/get-famous-places-insert', this.famousPlacesController.getFamousPlacesInsert.bind(this.famousPlacesController));
    this.router.post(
      '/get-popular-destination-by-city',
      this.famousPlacesController.getPopularDestinationByCity.bind(this.famousPlacesController)
    );
    this.router.post('/get-place-details', this.famousPlacesController.getPlaceDetails.bind(this.famousPlacesController));
    this.router.post('/get-near-by-places', this.famousPlacesController.getNearByPlaces.bind(this.famousPlacesController));
  }
}

export default FamousPlacesRoutes;
