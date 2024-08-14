import express from 'express';
import path from 'path';
import Database from './src/database/Database';
import ContinentRoutes from './src/routes/ContinentRoutes';
import CountryRoutes from './src/routes/CountryRoutes';
import FamousCityPlacesRoutes from './src/routes/FamouseCityPlacesRoutes';
import FamousPlacesRoutes from './src/routes/FamousPlacesRoutes';
import UserRoutes from './src/routes/UserRoutes';

class App {
  public app: express.Application;
  private continentRoutes: ContinentRoutes;
  private countryRoutes: CountryRoutes;
  private famousCityPlacesRoutes: FamousCityPlacesRoutes;
  private famousPlacesRoutes: FamousPlacesRoutes;
  private userRoutes: UserRoutes;
  private uploadsPath: string;
  constructor() {
    this.app = express();
    this.continentRoutes = new ContinentRoutes();
    this.countryRoutes = new CountryRoutes();
    this.famousCityPlacesRoutes = new FamousCityPlacesRoutes();
    this.famousPlacesRoutes = new FamousPlacesRoutes();
    this.userRoutes = new UserRoutes();
    this.uploadsPath = path.join(__dirname, 'uploads');
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use('/api/continents', this.continentRoutes.router);
    this.app.use('/api/countries', this.countryRoutes.router);
    this.app.use('/api/famous-city-places', this.famousCityPlacesRoutes.router);
    this.app.use('/api/famous-places', this.famousPlacesRoutes.router);
    this.app.use('/api/users', this.userRoutes.router);
    this.app.use('/uploads', express.static(this.uploadsPath));
  }

  private async connectDatabase() {
    await Database.getInstance();
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running at.... http://127.0.0.1:${port}/`);
    });
  }
}

export default App;
