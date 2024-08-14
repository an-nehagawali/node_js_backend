import { ObjectSchema, ValidationResult } from 'joi';

export abstract class BaseValidator {
  protected schema: ObjectSchema;

  constructor(schema: ObjectSchema) {
    this.schema = schema;
  }

  public validate(data: any): ValidationResult {
    return this.schema.validate(data);
  }
}
