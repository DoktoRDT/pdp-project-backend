import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../order';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  @ApiProperty({ enum: Order, enumName: 'Order', required: false })
  readonly order: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly skip: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsOptional()
  @ApiProperty({ required: false })
  readonly take: number = 20;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly q?: string;
}
