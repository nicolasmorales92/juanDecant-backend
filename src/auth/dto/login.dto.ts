import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class loginDTO {
    @ApiProperty({
        example: 'juan@gmail.com'
    })
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'Abc1234!'
    })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string
}