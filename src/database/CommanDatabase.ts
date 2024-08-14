import * as dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';

dotenv.config({ path: './src/config/.env' });

export class CommanDatabase {
  private static instance: CommanDatabase;
  private client: MongoClient;
  private db: Db;
  private static readonly dbUrl: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
  private static readonly dbName: string = process.env.DB_NAME ?? '';

  private constructor() {
    this.client = new MongoClient(CommanDatabase.dbUrl, {});
    this.db = this.client.db(CommanDatabase.dbName);
  }

  public static async getInstance(): Promise<CommanDatabase> {
    if (!CommanDatabase.instance) {
      CommanDatabase.instance = new CommanDatabase();
      await CommanDatabase.instance.client.connect();
    }
    return CommanDatabase.instance;
  }

  public getClient(): MongoClient {
    return this.client;
  }

  public getDb(): Db {
    return this.db;
  }
}

export default CommanDatabase;
