import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuarios } from './entities/usuarios.entity';
import { UsuarioRepository } from './usuarios.repository';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuariosRepository: UsuarioRepository
  ){}
  async verUsuarios(page?: number, limit?:number) {
     if (page && limit) {
      const skip = (page - 1) * limit
      const take = limit

    return await this.usuariosRepository.verUsuarios(skip, limit)
     }

    return await this.usuariosRepository.verUsuarios()
  }


  async findById(id: string) {
    const usuario = await this.usuariosRepository.findOneById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }


  
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findById(id); 
    return await this.usuariosRepository.updateUsuario(id, updateUsuarioDto);
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
