import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt({ message: 'Tổng số trang không đúng định dạng' })
  @Min(1, { message: 'Số trang phải trên 1' })
  current: number;

  @Type(() => Number)
  @IsInt({ message: 'Tổng số trang không đúng định dạng' })
  @Min(1, { message: 'Tổng số trang phải trên 1' })
  total: number;
}
