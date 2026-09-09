import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CrearUsuarioDTO } from './dto/create-auth.dto';
import { loginDTO } from './dto/login.dto';
import { RestaurarPasswordDto } from './dto/restaurar-password.dto';
import { OlvidePasswordDto } from './dto/olvide-mi-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('registro')
  async crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDTO) {
    const nuevoUsuario = await this.authService.crearUsuario(crearUsuarioDto);
    return{
      message: `Usuario ${nuevoUsuario.nombre} creado.`
    }
  }

  @Post('login')
  async login(@Body() login: loginDTO){
    console.log(login.email)
    return await this.authService.login(login)
  }



  @Post('olvide-mi-password')
  async olvideMiContraseña(@Body() dto: OlvidePasswordDto) {
    return this.authService.olvideMiContraseña(dto.email);
  }


  

  @Post('restaurar-password')
  async restaurarContraseña(@Body() dto: RestaurarPasswordDto) {
  return this.authService.restaurarContraseña(dto.token, dto.newPassword);
}

}
