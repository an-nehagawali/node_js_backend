import { Router } from 'express';
import CountryController from '../controllers/CountryController';

class CountryRoutes {
  public router: Router;
  private countryController: CountryController;

  constructor() {
    this.router = Router();
    this.countryController = new CountryController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/getAllDataToInsertIntoDatabase', this.countryController.getAllDataToInsertIntoDatabase.bind(this.countryController));
    this.router.get('/get-all-coutry-data', this.countryController.getAllCountryData.bind(this.countryController));
    this.router.post('/get-countries-by-continent', this.countryController.getCountriesByContinent.bind(this.countryController));
    this.router.get('/get-countries-list', this.countryController.getCountriesList.bind(this.countryController));
  }
}
export default CountryRoutes;
