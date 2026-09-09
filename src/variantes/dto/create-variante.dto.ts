import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateVarianteDto {
    @ApiProperty({
        example: 10
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    stock: number

    @ApiProperty({
        example: "5mm"
    })
    @IsString()
    @IsNotEmpty()
    mililitros: string

    @ApiProperty({
        example: 19000
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    precio: number
}
