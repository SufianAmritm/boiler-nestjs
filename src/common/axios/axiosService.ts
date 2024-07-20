import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAxiosService } from './interface/axios-service.interface';

export class AxiosService implements IAxiosService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  async post<T>(
    url: string,
    data: T | T[],
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return this.axiosInstance.post(url, data, config);
  }

  async fetch(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return this.axiosInstance.get(url, config);
  }
}
