import { IsEmail, IsNotEmpty } from 'class-validator';

export class OlvidePasswordDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;
}