import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator"
import { ProvinciasEnum } from "../../usuarios/enums/provincias.enum"
import { BarriosBuenosAiresEnum } from "../../usuarios/enums/barriosBuenosAires.enum"
import { BarriosCABAEnum } from "../../usuarios/enums/barriosCaba.enum"
import { TodasLasCiudadesEnum } from "../../usuarios/enums/todasLasCiudades.enum"

export class CrearUsuarioDTO {
    @ApiProperty({
        example: 'Juan'
    })
    @IsString()
    @IsNotEmpty()
    nombre: string

    @ApiProperty({
        example: 'Morales'
    })
    @IsString()
    @IsNotEmpty()
    apellido: string

    @ApiProperty({
        example: 'juan@example.com'
    })
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'Abc1234!'
    })
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        example: 'Buenos Aires'
    })
    @IsEnum(ProvinciasEnum)
    @IsNotEmpty()
    provincia: ProvinciasEnum

    @ApiProperty({
        example: 'Tigre'
    })
    @IsEnum(TodasLasCiudadesEnum)
    @IsNotEmpty()
    ciudad: TodasLasCiudadesEnum

    @ApiProperty({
        example: 'San Martin 435'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/.*\s\d+$/, {
        message: "La dirección debe contener calle y altura (ej: Av. San Martin 435)"
    })
    calle: string
}
