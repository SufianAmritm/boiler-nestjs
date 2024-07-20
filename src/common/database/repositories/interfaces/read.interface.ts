import { PaginationDto } from 'src/common/dtos/request/pagination.dto';
import { PagedList } from 'src/common/types/paged-list';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { FindOptions } from '../../builder-pattern/find-options.builder';

export interface IRead<T> {
  find(
    selectOption?: FindOptionsSelect<T>,
    orderOptions?: FindOptionsOrder<T>,
  ): Promise<T[]>;
  findWithPagination(
    paginationDto: PaginationDto,
    options?: FindOptions<T>,
  ): Promise<PagedList<T>>;
  findOne(
    whereOption: FindOptionsWhere<T>,
    selectOption: FindOptionsSelect<T>,
    relationOption?: FindOptionsRelations<T>,
  ): Promise<T>;
  whereIn(whereOption: FindManyOptions<T>): Promise<T[]>;
  findOneWithBuilderOption(options?: FindOptions<T>): Promise<T>;
  exist(whereOption: FindOptionsWhere<T>): Promise<T>;
}
