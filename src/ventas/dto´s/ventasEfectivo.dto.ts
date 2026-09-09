import { IsString, IsArray, ValidateNested, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CrearDellateVentaDto } from '../../detalle_ventas/dto/crear.detalle_venta.dto';
import { ApiProperty } from '@nestjs/swagger';


export class CrearVentaEfectivoDto {
    @IsString()
    @IsOptional()
    @ApiProperty(
        {example: "Javier"}
    )
    nombreClienteCasual?: string

    @IsString()
    @IsOptional()
    @ApiProperty(
        {example: "Mora"}
    )
    apellidoClienteCasual?: string

    @IsOptional()
    @IsString()
    @ApiProperty(
        {example: "javier@example.com"}
    )
    emailClienteCasual: string;

     @ApiProperty({
            type: CrearDellateVentaDto,
            isArray: true,
            example: [{ productoId: "", varianteId: "", cantidad: 3 }]
        })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CrearDellateVentaDto)
    items: CrearDellateVentaDto[];
}