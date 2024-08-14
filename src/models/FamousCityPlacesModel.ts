import { Collection, Db } from 'mongodb';
import Database from '../database/Database';

class FamousCityPlacesModel {
  private db: Db | undefined;
  private collection: Collection | undefined;
  private collection2: Collection | undefined;
  private async initialize(): Promise<void> {
    try {
      const dbInstance = await Database.getInstance();
      this.db = dbInstance.getDb();
      this.collection = this.db.collection('pg_famous_city_places');
      this.collection2 = this.db.collection('pg_famous_city_continent_wise');
    } catch (error) {
      console.error('Failed to initialize famouse city model', error);
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

  public async insertMany(data: any[]) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    try {
      const result = await this.collection.insertMany(data);
      return result;
    } catch (error) {
      console.error('Failed to create famous city places data', error);
      throw error;
    }
  }
  public async insertDetails(data: any[]) {
    await this.ensureInitialized();
    if (!this.collection2) {
      throw new Error('Collection not initialized');
    }
    try {
      const result = await this.collection2.insertMany(data);
      return result;
    } catch (error) {
      console.error('Failed to create famous city places data', error);
      throw error;
    }
  }
  public async findByCountry(country: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.find({ country_name: country }).sort({ city_name: 1 }).toArray();
  }

  public async findByCity(city: string) {
    await this.ensureInitialized();
    if (!this.collection2) {
      throw new Error('Collection not initialized');
    }
    return this.collection2.find({ city_name: city }).toArray();
  }
}
export default FamousCityPlacesModel;
