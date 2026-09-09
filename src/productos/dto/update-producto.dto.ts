import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';
import { UpdateVarianteDto } from '../../variantes/dto/update-variante.dto';

export class UpdateProductoDto extends PartialType(
  OmitType(CreateProductoDto, ['variantes'] as const) 
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVarianteDto)
  variantes?: UpdateVarianteDto[]; 
}