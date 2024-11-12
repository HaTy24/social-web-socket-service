import { IsOptional, Max, Min } from 'class-validator';

export abstract class PaginationDTO {
  @Min(0)
  @IsOptional()
  offset?: number;

  @Min(1)
  @Max(20)
  @IsOptional()
  limit?: number;

  @Min(1)
  @Max(60)
  @IsOptional()
  sort?: string;

  // Purpose is to disallow external services to touch the original filter
  protected _filter: Record<string, any> = {};

  protected abstract parseFilters(): void;

  public get filter(): Record<string, any> {
    this.parseFilters();

    return this._filter;
  }

  public addFilter(newFilter: Record<string, any>): void {
    this._filter = Object.assign(this._filter, newFilter);
  }
}
