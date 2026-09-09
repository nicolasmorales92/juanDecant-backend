import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CrearUsuarioDTO } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ProvinciasEnum } from '../usuarios/enums/provincias.enum';
import { loginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepositorio: Repository<Usuarios>,
    private readonly jwtService : JwtService,
    private readonly mailerService: MailerService,
  )
  {}
  async crearUsuario(crearUsuarioDto: CrearUsuarioDTO) {
    const usuarioRepetido = await this.usuarioRepositorio.findOne({
      where: {email: crearUsuarioDto.email}
    })
    
    if(usuarioRepetido) throw new ConflictException('El email ya está en uso.')
    
    const contraseñaHasheada = await bcrypt.hash(crearUsuarioDto.password, 10)
    const ciudad = crearUsuarioDto.ciudad 
    const provincia = crearUsuarioDto.provincia as ProvinciasEnum

    const usuarioNuevo = await this.usuarioRepositorio.create({
      ...crearUsuarioDto,
      password: contraseñaHasheada,
      ciudad: ciudad,
      provincia: provincia
    })

    return await this.usuarioRepositorio.save(usuarioNuevo)
  }


  async login(login: loginDTO){
    const usuario = await this.usuarioRepositorio.findOne({
      where: {email: login.email}
    })

    if(!usuario) throw new BadRequestException('Usuario y/o contraseña incorrecta.')

    const contraseñaValida = await bcrypt.compare(login.password, usuario.password)
    if(!contraseñaValida) throw new BadRequestException('Usuario y/o contraseña incorrecta.')

    const payload = {
      sub: usuario.id,
      id: usuario.id,
      rol: usuario.rol
    }

    try{
      const token = await this.jwtService.signAsync(payload)
      return{
        message: `Registro exítoso`,
        token
      }
    }
    catch (error){
        console.error("Error al firmar el token:", error);
        throw new InternalServerErrorException('Error al generar el acceso');
    }
  }




  async olvideMiContraseña(email: string) {
    const usuario = await this.usuarioRepositorio.findOne({ where: { email } });

    if (!usuario) {
      return { message: 'Si el correo está registrado, recibirás las instrucciones en tu bandeja de entrada.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: usuario.id, email: usuario.email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/restaurar-password?token=${encodeURIComponent(resetToken)}`;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1a202c; text-align: center;">Restablecer contraseña</h2>
          <p style="color: #4a5568;">Hola,</p>
          <p style="color: #4a5568;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para ingresar una nueva clave (este enlace expira en 15 minutos):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #718096; font-size: 12px;">Si no solicitaste este cambio, podés ignorar este correo.</p>
        </div>
      `,
    });

    return { message: 'Si el correo está registrado, recibirás las instrucciones en tu bandeja de entrada.' };
  }




  async restaurarContraseña(token: string, newPass: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const usuario = await this.usuarioRepositorio.findOne({ where: { id: payload.sub } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const hashedPassword = await bcrypt.hash(newPass, 10);
      usuario.password = hashedPassword;

      await this.usuarioRepositorio.save(usuario);

      return { message: 'Contraseña actualizada con éxito.' };
    } catch (error) {
      throw new BadRequestException('El enlace es inválido o ha expirado.');
    }
  }
 
}
