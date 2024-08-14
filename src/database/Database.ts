import * as dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';

dotenv.config({ path: './src/config/.env' });
class Database {
  private static instance: Database;
  private db!: Db;
  private static readonly url: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
  private static readonly dbName: string = process.env.DB_NAME ?? '';

  private constructor() {}

  public static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.connect();
    }
    return Database.instance;
  }

  private async connect(): Promise<void> {
    try {
      const client = new MongoClient(Database.url, { serverSelectionTimeoutMS: 30000 });
      await client.connect();
      this.db = client.db(Database.dbName);
      console.log('MongoDB connected');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }
}

export default Database;
