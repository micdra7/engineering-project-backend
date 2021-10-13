import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;
}
export class PaginationResponse<T> {
  data: T[];

  @ApiProperty()
  meta: PaginationMeta;
}
