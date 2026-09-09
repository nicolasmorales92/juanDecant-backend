import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { CreateVarianteDto } from "../../variantes/dto/create-variante.dto"
import { GeneroEnum } from "../enum´s/genero.enum"



export class CreateProductoDto {
    @ApiProperty({
        example: "212"
    })
    @IsString()
    @IsNotEmpty()
    nombre: string

    @ApiProperty({
        example: "Carolina Herrera"
    })
    @IsString()
    @IsNotEmpty()
    marca: string

    @ApiProperty({
        example: "Mujer"
    })
    @IsEnum(GeneroEnum)
    @IsNotEmpty()
    genero: GeneroEnum

    @ApiProperty({
        example: "Rico perfume"
    })
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsArray()
    @IsOptional()
    imagenes?: string[]

    @ApiProperty({
        type: CreateVarianteDto,
        isArray: true,
        example: [{ stock: 10, mililitros: "5mm", precio: 19000 }]
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateVarianteDto)
    variantes: CreateVarianteDto[];
}


