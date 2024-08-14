import axios from 'axios';
import { Request, Response } from 'express';
import CountryModel from '../models/CountryModel';
import { ResponseFormatter } from '../utils/ResponseFormatter';

class CountryController {
  private countryModel: CountryModel;

  constructor() {
    this.countryModel = new CountryModel();
  }

  public async getAllDataToInsertIntoDatabase(req: Request, res: Response): Promise<void> {
    try {
      const response = await axios.get(`${process.env.SECONDARY_DB_DOMAIN}/get-all-coutry-data`);
      const data = response.data.data;
      if (data.length > 0) {
        await this.countryModel.insertMany(data);
        res.status(200).json({ message: 'Data inserted successfully' });
      } else {
        res.status(200).json({ message: 'No data to insert' });
      }
    } catch (error) {
      console.error('Error making GET request or inserting data:', error);
      res.status(500).json({ message: 'Failed to insert data' });
    }
  }

  public async getAllCountryData(req: Request, res: Response): Promise<void> {
    try {
      const countryDetails = await this.countryModel.findAll();
      if (!countryDetails.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No country found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(countryDetails, 200, 'All country'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get countries.', err));
    }
  }

  public async getCountriesByContinent(req: Request, res: Response): Promise<void> {
    try {
      const { continent_code } = req.body;

      const countryDetails = await this.countryModel.findByContinent(continent_code);
      if (!countryDetails.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No country found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(countryDetails, 200, 'All country'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get countries.', err));
    }
  }
  public async getCountriesList(req: Request, res: Response): Promise<void> {
    try {
      const countryDetails = await this.countryModel.findCountriesList();
      if (!countryDetails.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No country found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(countryDetails, 200, 'All country'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get countries.', err));
    }
  }
}

export default CountryController;
