export class PageOptionsDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;

  constructor(data: { page: number; limit: number; total: number }) {
    this.page = data.page;
    this.limit = data.limit;
    this.total = data.total;
    this.totalPages = Math.ceil(data.total / data.limit);
  }
}
