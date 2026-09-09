import { PartialType } from '@nestjs/swagger';
import { CreateVarianteDto } from './create-variante.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVarianteDto extends PartialType(CreateVarianteDto) {
    @IsOptional()
    @IsString()
    id?: string;
}
