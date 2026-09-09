import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { CrearDellateVentaDto } from "../../detalle_ventas/dto/crear.detalle_venta.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { EstadoVenta, MetodoPago } from "../enums/ventas.enums";

export class VentaMercadoPagoDto {

    @ApiProperty({
        type: [CrearDellateVentaDto],
        example: [
            {
                "productoId": "",
                "varianteId": "",
                "cantidad": "2"
            },
             {
                "productoId": "",
                "varianteId": "",
                "cantidad": "3"
            }

        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CrearDellateVentaDto) 
    items: CrearDellateVentaDto[]
}