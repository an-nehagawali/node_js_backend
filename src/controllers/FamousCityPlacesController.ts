import axios from 'axios';
import { Request, Response } from 'express';
import FamousCityPlacesModel from '../models/FamousCityPlacesModel';
import { ResponseFormatter } from '../utils/ResponseFormatter';
class FamousCityPlacesController {
  private famousCityPlacesModel: FamousCityPlacesModel;
  constructor() {
    this.famousCityPlacesModel = new FamousCityPlacesModel();
  }
  public async getAllFamousCityPlaces(req: Request, res: Response) {
    try {
      const famousCityPlaces = await this.famousCityPlacesModel.findAll();
      if (!famousCityPlaces.length) {
        res.status(400).json(ResponseFormatter.formatResponse(null, 404, 'No famous city places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousCityPlaces, 200, 'All famous city places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous city places.', err));
    }
  }

  public async getCitiesByCountryInsert(req: Request, res: Response) {
    try {
      const response = await axios.get(`${process.env.SECONDARY_DB_DOMAIN}/pg_famous_city_places`);
      const data = response.data.data;
      if (data.length > 0) {
        await this.famousCityPlacesModel.insertMany(data);
        res.status(200).json({ message: 'Data inserted successfully' });
      } else {
        res.status(200).json({ message: 'No data to insert' });
      }
    } catch (error) {
      console.error('Error making GET request or inserting data:', error);
      res.status(500).json({ message: 'Failed to insert data into famous city places' });
    }
  }

  public async getCitiesByCountry(req: Request, res: Response) {
    try {
      const { country_name } = req.body;
      const famousCityPlaces = await this.famousCityPlacesModel.findByCountry(country_name);
      if (!famousCityPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous city places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousCityPlaces, 200, 'All famous city places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous city places.', err));
    }
  }
  public async getCitiesContinentWiseInsert(req: Request, res: Response) {
    try {
      const response = await axios.get(`${process.env.SECONDARY_DB_DOMAIN}/pg_famous_city_continent_wise`);
      const data = response.data.data;
      if (data.length > 0) {
        await this.famousCityPlacesModel.insertDetails(data);
        res.status(200).json({ message: 'Data inserted successfully' });
      } else {
        res.status(200).json({ message: 'No data to insert' });
      }
    } catch (error) {
      console.error('Error making GET request or inserting data:', error);
      res.status(500).json({ message: 'Failed to insert data into famous city places' });
    }
  }

  public async getCityDetailByName(req: Request, res: Response) {
    try {
      const { city_name } = req.body;
      const famousCityPlaces = await this.famousCityPlacesModel.findByCity(city_name);
      if (!famousCityPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous city places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousCityPlaces, 200, 'All famous city places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous city places.', err));
    }
  }
}
export default FamousCityPlacesController;
