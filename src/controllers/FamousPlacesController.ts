import axios from 'axios';
import { Request, Response } from 'express';
import FamousPlacesModel from '../models/FamousPlacesModel';
import { ResponseFormatter } from '../utils/ResponseFormatter';
class FamousPlacesController {
  private famousPlacesModel: FamousPlacesModel;

  constructor() {
    this.famousPlacesModel = new FamousPlacesModel();
  }
  public async getAllFamousPlaces(req: Request, res: Response): Promise<void> {
    try {
      const famousPlaces = await this.famousPlacesModel.findAll();
      if (!famousPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousPlaces, 200, 'All famous places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous places.', err));
    }
  }

  public async getFamousPlacesInsert(req: Request, res: Response): Promise<void> {
    try {
      const response = await axios.get(`${process.env.SECONDARY_DB_DOMAIN}/get-all-famous-places`);
      const data = response.data.data;
      if (data.length > 0) {
        await this.famousPlacesModel.insertMany(data);
        res.status(200).json({ message: 'Data inserted successfully' });
      } else {
        res.status(200).json({ message: 'No data to insert' });
      }
    } catch (error) {
      console.error('Error making GET request or inserting data:', error);
      res.status(500).json({ message: 'Failed to insert data' });
    }
  }

  public async getPopularDestinationByCity(req: Request, res: Response): Promise<void> {
    try {
      const { city_name } = req.body;

      const famousPlaces = await this.famousPlacesModel.findByCity(city_name);
      if (!famousPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousPlaces, 200, 'All famous places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous places.', err));
    }
  }

  public async getPlaceDetails(req: Request, res: Response): Promise<void> {
    try {
      const { location_id } = req.body;

      const famousPlaces = await this.famousPlacesModel.findByLocationId(location_id);
      if (!famousPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousPlaces, 200, 'All famous places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous places.', err));
    }
  }

  public async getNearByPlaces(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, distance } = req.body; //Object Destructuring
      console.log('** ->  ~ getNearByPlaces ~ latitude:', latitude);

      const famousPlaces = await this.famousPlacesModel.findNearByPlaces(latitude, longitude, distance);
      console.log('** ->  ~ getNearByPlaces ~ famousPlaces:', famousPlaces);

      if (!famousPlaces.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No famous places found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(famousPlaces, 200, 'All famous places'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get famous places.', err as string));
    }
  }
}
export default FamousPlacesController;
