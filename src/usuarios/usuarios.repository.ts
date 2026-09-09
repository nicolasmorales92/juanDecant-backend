import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuarios } from "./entities/usuarios.entity";
import { Repository } from "typeorm";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";

@Injectable()
export class UsuarioRepository {
    constructor(
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<Usuarios>
    ) { }

    async verUsuarios(skip?: number, take?: number):Promise<Usuarios[]> {
        return await this.usuarioRepository.find({
            select:
            {
                nombre: true,
                apellido: true,
                email: true,
                ciudad: true,
                calle: true
            },
            skip: skip,
            take: take
        })
    }


    async findOneById(id: string): Promise<Usuarios | null> {
    return await this.usuarioRepository.findOne({
      where: { id },
      select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      provincia: true,
      ciudad: true,
      calle: true,
      compras: true,
    },
    });
  }

  async updateUsuario(id: string, updateDto: UpdateUsuarioDto):Promise<Usuarios | null> {
    await this.usuarioRepository.update(id, updateDto);
    return this.findOneById(id);
  }


}