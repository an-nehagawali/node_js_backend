import { ApiResponseBase } from './apiResponseInterface';
export interface ICountry {
  id?: number;
  continent_code?: string;
  country_code?: string;
  country_description?: string;
  country_id?: number;
  country_name?: string;
  country_img?: string;
  lng?: number;
  lat?: number;
  language?: string;
}
export type countryDetailResponse = ApiResponseBase<ICountry[]>;
