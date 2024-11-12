import { Model } from 'mongoose';

import { FindOptions } from '@shared/interfaces';

import { PaginationDTO } from './dto/pagination.dto';

export class BaseCRUDService {
  constructor(protected domainModel: Model<any, any>) {}

  protected parseLimit(limit: number) {
    return limit || 10;
  }

  protected parseSkip(offset: number) {
    return offset || 0;
  }

  protected addNonActiveRecordsFilter(filter: any) {
    if (!filter) {
      return {
        isactive: true,
      };
    }

    filter.isactive = true;

    return filter;
  }

  public getOne(filter: any = {}, options: Partial<FindOptions> = {}) {
    const query = this.domainModel.findOne(filter);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    if (options.sort) {
      query.sort(options.sort);
    }

    return query.exec();
  }

  public count(filter: any = {}) {
    return this.domainModel.count(filter);
  }

  public async paginate(
    pagingDTO: PaginationDTO,
    options: Partial<FindOptions> = {},
  ) {
    const { limit, offset, filter } = pagingDTO || {};

    const total = await this.domainModel.count(filter);
    const findQuery = this.domainModel
      .find(filter)
      .skip(this.parseSkip(offset))
      .limit(this.parseLimit(limit));

    if (pagingDTO.sort || options.sort) {
      findQuery.sort(options.sort || pagingDTO.sort);
    }

    if (options.populate) {
      findQuery.populate(options.populate);
    }

    if (options.select) {
      findQuery.select = options.select;
    }

    const rows = await findQuery.exec();

    return {
      rows,
      total,
      limit,
      offset,
    };
  }

  public async getAll(filter?: any, options: Partial<FindOptions> = {}) {
    const findQuery = this.domainModel.find(filter);

    if (options.sort) {
      findQuery.sort(options.sort);
    }

    if (options.populate) {
      findQuery.populate(options.populate);
    }

    if (options.select) {
      findQuery.select = options.select;
    }

    const rows = await findQuery.exec();

    return rows;
  }

  public getById(id: string, options: Partial<FindOptions> = {}) {
    const findQuery = this.domainModel.findById(id);

    if (options.populate) {
      findQuery.populate(options.populate);
    }

    if (options.select) {
      findQuery.select(options.select);
    }

    return findQuery.exec();
  }

  public create(createDTO: any) {
    return this.domainModel.create(createDTO);
  }

  public updateById(id: string, updateDTO: any) {
    return this.domainModel.findByIdAndUpdate(id, updateDTO, { new: true });
  }

  public bulkUpdate(criteria: any, updateDTO: any) {
    return this.domainModel.updateMany(criteria, updateDTO, {
      new: true,
    });
  }

  public deleteById(id: string) {
    return this.domainModel.findByIdAndUpdate(id, {
      isactive: false,
    });
  }
}
