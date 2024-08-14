import { ICountry } from 'interfaces/countryInterface';
import { Collection, Db } from 'mongodb';
import Database from '../database/Database';

class CountryModel {
  private db: Db | undefined;
  private collection: Collection | undefined;

  private async initialize(): Promise<void> {
    try {
      const dbInstance = await Database.getInstance();
      this.db = dbInstance.getDb();
      this.collection = this.db.collection('pg_famous_tourist_country');
    } catch (error) {
      console.error('Failed to initialize country model', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.collection) {
      await this.initialize();
    }
  }

  public async findAll() {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.find().toArray();
  }

  public async insertMany(data: ICountry[]) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    try {
      const result = await this.collection.insertMany(data);
      return result;
    } catch (error) {
      console.error('Failed to create country data', error);
      throw error;
    }
  }

  public async findByContinent(continent: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.find({ continent_code: continent }).sort({ country_name: 1 }).toArray();
  }

  public async findCountriesList() {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }

    return this.collection
      .aggregate([
        {
          $group: {
            _id: '$country_name',
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();
  }
}

export default CountryModel;
