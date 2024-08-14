import { Schema } from 'mongoose';

export class ContinentSchema {
  public static readonly schema = new Schema({
    title: { type: String },
    description: { type: String },
    alias: { type: String },
    code: { type: String },
    image: { type: String },
  });

  public static getSchema() {
    return this.schema;
  }
}
export default ContinentSchema;
