export interface IResponse<T> {
  code: string;
  message: string;
  data: T;
}