import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpHeader {
  [key: string]: any;
}

export const IAxiosService = Symbol('IAxiosService');

export interface IAxiosService {
  post<T>(
    url: string,
    data: T | T[],
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>>;
  fetch(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>>;
}
