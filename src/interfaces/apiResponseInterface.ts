export interface ApiResponseBase<T> {
  data: T;
  status: number;
  error: string;
  message: string;
}
