import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Venta } from "./entities/venta.entity";
import { Repository } from "typeorm";
import { tr } from "date-fns/locale";


@Injectable()
export class VentasRepository {
    constructor(
        @InjectRepository(Venta)
        private readonly ventasRepository: Repository<Venta>
    ) { }


    async verVentasAdmin(skip?: number, take?: number) {
        const query = this.ventasRepository
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.usuario', 'usuario')
            .leftJoinAndSelect('venta.detalle_venta', 'detalle_venta')
            .leftJoinAndSelect('detalle_venta.producto', 'producto')
            .leftJoinAndSelect('detalle_venta.variante', 'variante')
            .orderBy('venta.fecha', 'DESC');

        if (skip !== undefined && take !== undefined) {
            query.skip(skip).take(take);
        }

        return await query.getMany();
    }




    async verVentasUsuario(userId: string, skip?: number, take?: number) {
        const query = this.ventasRepository
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.usuario', 'usuario')
            .leftJoinAndSelect('venta.detalle_venta', 'detalle_venta')
            .leftJoinAndSelect('detalle_venta.producto', 'producto')
            .leftJoinAndSelect('detalle_venta.variante', 'variante')
            .where('usuario.id = :userId', { userId }) // <--- Filtramos por el ID del usuario autenticado
            .orderBy('venta.fecha', 'DESC');

        if (skip !== undefined && take !== undefined) {
            query.skip(skip).take(take);
        }

        return await query.getMany();
    }





    
    async verVentasById(id: string) {
        return await this.ventasRepository.findOne({
            where: { id: id },
            relations: {
                usuario: true,
                detalle_venta: {
                    producto: true
                }
            }
        })
    }
}