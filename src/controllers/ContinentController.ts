import axios from 'axios';
import { Request, Response } from 'express';
import ContinentModel from '../models/ContinentModel';
import { ResponseFormatter } from '../utils/ResponseFormatter';

class ContinentController {
  private continentModel: ContinentModel;

  constructor() {
    this.continentModel = new ContinentModel();
  }

  public async addContinent(req: Request, res: Response): Promise<void> {
    try {
      const isInserted = await this.continentModel.create(req.body);
      if (isInserted) {
        res.status(201).json(ResponseFormatter.formatResponse(null, 201, 'Continent added successfully'));
      } else {
        res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to add continent'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to add continent.', err));
    }
  }

  public async getAllContinents(req: Request, res: Response): Promise<void> {
    try {
      const continentDetails = await this.continentModel.findAll();
      if (!continentDetails.length) {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'No continents found'));
      } else {
        res.status(200).json(ResponseFormatter.formatResponse(continentDetails, 200, 'All continents'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get continents.', err));
    }
  }

  public async getContinentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const continentDetail = await this.continentModel.findById(id);
      if (continentDetail) {
        res.json(ResponseFormatter.formatResponse(continentDetail, 200, 'Continent details'));
      } else {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'Continent not found'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to get continent details', err));
    }
  }
  public async updateContinent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const isUpdated = await this.continentModel.update(id, req.body);
      if (isUpdated) {
        res.json(ResponseFormatter.formatResponse(null, 200, 'Continent updated successfully'));
      } else {
        res.status(404).json(ResponseFormatter.formatResponse(null, 404, 'Continent not found'));
      }
    } catch (err) {
      res.status(500).json(ResponseFormatter.formatResponse(null, 500, 'Failed to update continent.', err));
    }
  }
  public async getAllData(req: Request, res: Response): Promise<void> {
    axios
      .get('http://localhost:8080/get-all-coutry-data')
      .then((response: any) => {
        res.json(response.data);
      })
      .catch((error: Error) => {
        console.error('Error making GET request:', error);
      });
  }
}
export default ContinentController;
