import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { Axios } from 'axios';
import { AxiosService } from './axiosService';
import { IAxiosService } from './interface/axios-service.interface';

const axiosServiceProvider = {
  provide: IAxiosService,
  useClass: AxiosService,
};

@Global()
@Module({
  imports: [HttpModule, Axios],
  providers: [axiosServiceProvider],
  exports: [axiosServiceProvider],
})
export class AxiosModule {}
