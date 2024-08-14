import { Request, Response } from 'express';
import CommanDatabase from '../database/CommanDatabase';
import CommonModel from '../models/CommanModel';

export class TestController {
  public commonModel!: CommonModel;

  constructor() {
    CommanDatabase.getInstance()
      .then((dbInstance) => {
        this.commonModel = new CommonModel(dbInstance.getDb(), 'pg_continents');
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
      });
  }

  public async getAllContinents(req: Request, res: Response): Promise<void> {
    try {
      const records = await this.commonModel.getAllRecords();
      res.json({ status: 200, message: 'Success', data: records });
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Error', error: error });
    }
  }

  public async getContinentById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const record = await this.commonModel.getRecordById(id);
      if (record) {
        res.json({ status: 200, message: 'Success', data: record });
      } else {
        res.status(404).json({ status: 404, message: 'Not Found' });
      }
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Error', error: error });
    }
  }

  // Other methods like addContinent, updateContinent, deleteContinent can be implemented similarly.
}

export default TestController;
