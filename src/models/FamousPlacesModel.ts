import { Collection, Db } from 'mongodb';
import Database from '../database/Database';

class FamousPlacesModel {
  private db: Db | undefined;
  private collection: Collection | undefined;

  private async initialize(): Promise<void> {
    try {
      const dbInstance = await Database.getInstance();
      this.db = dbInstance.getDb();
      this.collection = this.db.collection('pg_famous_places');
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

  public async insertMany(data: any) {
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

  public async findByCity(city: string) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    const projection = { _id: 1, location_id: 1, name: 1, city_name: 1, photo: 1 };
    return this.collection.find({ city_name: city }).sort({ city_name: 1 }).project(projection).toArray();
  }

  public async findByLocationId(locationId: number) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    const projection = {
      name: 1,
      city_name: 1,
      photo: 1,
      description: 1,
      location_id: 1,
      longitude: 1,
      latitude: 1,
      rating: 1,
      num_reviews: 1,
      address: 1,
      phone: 1,
      website: 1,
    };
    return this.collection.find({ location_id: locationId }).project(projection).toArray();
  }

  public async findNearByPlaces(latitude: number, longitude: number, distance: number) {
    await this.ensureInitialized();
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }
    const projection = {
      name: 1,
      city_name: 1,
      photo: 1,
      description: 1,
      location_id: 1,
      longitude: 1,
      latitude: 1,
      rating: 1,
      num_reviews: 1,
      address: 1,
      phone: 1,
      website: 1,
    };
    return this.collection
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: distance,
          },
        },
      })
      .project(projection).toArray;
  }
}
export default FamousPlacesModel;
