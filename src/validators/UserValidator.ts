import Joi from 'joi';
import { BaseValidator } from './BaseValidator';

export class UserValidator extends BaseValidator {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().min(3).max(30).required(),
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        confirmEmail: Joi.ref('email'),
        password: Joi.string().min(6).required(),
        verifyPassword: Joi.ref('password '),
        gender: Joi.string(),
        description: Joi.string(),
        url: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        tos: Joi.boolean().valid(true).required(),
      })
    );
  }
}
