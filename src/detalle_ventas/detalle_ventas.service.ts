import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateVentasDetalleDto } from './dto/update-ventas_detalle.dto';
import { CrearDellateVentaDto } from './dto/crear.detalle_venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVentas } from './entities/detalle_ventas.entity';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVentas)
    private readonly detalleVenta: Repository<DetalleVentas>
  ){}
  async crear(crearVentasDetalleDto: CrearDellateVentaDto, usuarioId: string) {
    
   
    return 'Hola'
    

  }

  findAll() {
    return `This action returns all ventasDetalles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ventasDetalle`;
  }

  update(id: number, updateVentasDetalleDto: UpdateVentasDetalleDto) {
    return `This action updates a #${id} ventasDetalle`;
  }

  remove(id: number) {
    return `This action removes a #${id} ventasDetalle`;
  }
}
