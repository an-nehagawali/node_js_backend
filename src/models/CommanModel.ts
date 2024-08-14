import { IContinent } from 'interfaces/continentInterface';
import { Collection, Db } from 'mongodb';

class CommonModel {
  private db: Db;
  private collection: Collection;

  constructor(db: Db, collectionName: string) {
    this.db = db;
    this.collection = this.db.collection(collectionName);
  }

  public async getAllRecords(): Promise<any[]> {
    return this.collection.find().toArray();
  }
  public async create(data: IContinent) {
    try {
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
  public async getRecordById(id: string): Promise<any> {
    //return this.collection.findOne({ _id: new ObjectId(id) });
  }

  // Other methods as needed
}

export default CommonModel;
