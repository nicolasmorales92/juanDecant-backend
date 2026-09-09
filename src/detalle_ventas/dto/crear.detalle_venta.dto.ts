import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from "class-validator"

export class CrearDellateVentaDto {
    @ApiProperty({
        example: 'ProductoId'
    })
    @IsUUID()
    @IsNotEmpty()
    productoId: string


    @ApiProperty({
        example: 'VarianteId'
    })
    @IsUUID()
    @IsNotEmpty()
    varianteId: string
    

    @ApiProperty({
        example: '3'
    })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    cantidad: number

}
