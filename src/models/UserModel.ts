import { Collection, Db } from 'mongodb';
import Database from '../database/Database';

class UserModel {
  private db: Db | undefined;
  private collection: Collection | undefined;

  private async initialize(): Promise<void> {
    try {
      const dbInstance = await Database.getInstance();
      this.db = dbInstance.getDb();
      this.collection = this.db.collection('pg_users');
    } catch (error) {
      console.error('Failed to initialize user model', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.collection) {
      await this.initialize();
    }
  }

  public async create(insertData: any) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection.insertOne(insertData);
  }

  public async findByEmail(email: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection && this.collection.findOne({ email });
  }
  public async findByUsername(username: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    return this.collection && this.collection.findOne({ username });
  }
}
export default UserModel;
