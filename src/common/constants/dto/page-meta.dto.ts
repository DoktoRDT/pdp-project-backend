import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {

  @ApiProperty()
  readonly total: number;

  constructor({ total }: PageMetaDto) {
    this.total = total;
  }
}
