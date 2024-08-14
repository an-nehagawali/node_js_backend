import { IContinent } from 'interfaces/continentInterface';
import { Collection, Db, ObjectId } from 'mongodb';
import Database from '../database/Database';

class ContinentModel {
  private db: Db | undefined;
  private collection: Collection | undefined;

  private async initialize(): Promise<void> {
    try {
      const dbInstance = await Database.getInstance();
      this.db = dbInstance.getDb();
      this.collection = this.db.collection('pg_continents');
    } catch (error) {
      console.error('Failed to initialize ContinentModel', error);
    }
  }
  private async ensureInitialized(): Promise<void> {
    if (!this.collection) {
      await this.initialize();
    }
  }
  public async create(data: IContinent) {
    try {
      await this.ensureInitialized();
      if (!this.collection) {
        throw new Error('Collection not initialized');
      }
      const continentData = await this.collection.insertOne({
        title: data.title,
        description: data.description ?? '',
        alias: data.alias,
        code: data.code,
        image: data.image,
      });
      return continentData;
    } catch (error) {
      console.error('Failed to create continent', error);
    }
  }

  public async insertMany(data: IContinent[]) {
    try {
      await this.ensureInitialized();
      if (!this.collection) {
        throw new Error('Collection not initialized');
      }
      const continentData = await this.collection.insertMany(data);
      return continentData;
    } catch (error) {
      console.error('Failed to create continent data', error);
    }
  }

  public async findAll() {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.find().toArray();
  }

  public async findById(id: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async update(id: string, data: IContinent): Promise<boolean> {
    try {
      await this.ensureInitialized();
      if (!this.collection) {
        throw new Error('Collection not initialized');
      }
      const isUpdated = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
      return isUpdated.modifiedCount > 0;
    } catch (error) {
      console.error('Failed to update continent', error);
      return false;
    }
  }
}

export default ContinentModel;
