import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVentas } from '../detalle_ventas/entities/detalle_ventas.entity';
import { Variantes } from '../variantes/entities/variantes.entity';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { MercadoPagoService } from '../mercado_pago/mercado_pago.service';
import { CrearVentaEfectivoDto } from './dto´s/ventasEfectivo.dto';
import { VentaMercadoPagoDto } from './dto´s/ventaMercadoPagodto';
import { Productos } from '../productos/entities/producto.entity';
import { EstadoVenta, MetodoPago } from './enums/ventas.enums';
import { VentasRepository } from './ventas.repository';

@Injectable()
export class VentasService {
  constructor(private readonly dataSource: DataSource,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly ventasRepository: VentasRepository
  ) { }
  async verVentasAdmin(page?: number, limit?: number) {
    if (page && limit) {
      const skip = (page - 1) * limit
      const take = limit

      return await this.ventasRepository.verVentasAdmin(skip, take)
    }

    return await this.ventasRepository.verVentasAdmin()
  }




  async verVentasUsuario(userId: string, page?: number, limit?: number) {
    if (page && limit) {
      const skip = (page - 1) * limit
      const take = limit

      return await this.ventasRepository.verVentasUsuario(userId,skip, take)
    }

    return await this.ventasRepository.verVentasUsuario(userId)
  }



  async verVentasById(id: string) {
    return await this.ventasRepository.verVentasById(id)
  }


  async crearVentaEfectivo(dto: CrearVentaEfectivoDto) {
    return await this.dataSource.transaction(async (manager) => {
      let usuarioExistente: Usuarios | null = null;
      let nombre = dto.nombreClienteCasual || null;
      let apellido = dto.apellidoClienteCasual || null;
      let email = dto.emailClienteCasual || null;

      if (dto.emailClienteCasual) {
        usuarioExistente = await manager.findOne(Usuarios, {
          where: { email: dto.emailClienteCasual.trim().toLowerCase() },
        });

        if (usuarioExistente) {
          nombre = usuarioExistente.nombre;
          apellido = usuarioExistente.apellido;
          email = usuarioExistente.email;
        }
      }

      let totalVenta = 0;
      const detallesAGuardar: DetalleVentas[] = [];

      for (const item of dto.items) {
        const variante = await manager.findOne(Variantes, {
          where: {
            id: item.varianteId,
            producto: { id: item.productoId },
          },
          relations: {
            producto: true,
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!variante) {
          throw new NotFoundException(
            `No se encontró la variante ID "${item.varianteId}" asociada al producto ID "${item.productoId}".`,
          );
        }

        if (variante.stock < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para la variante ID "${item.varianteId}". Disponible: ${variante.stock}, solicitado: ${item.cantidad}.`,
          );
        }

        variante.stock -= item.cantidad;
        await manager.save(Variantes, variante);

        const precioUnitario = variante.precio;
        const subtotal = precioUnitario * item.cantidad;
        totalVenta += subtotal;

        const detalle = manager.create(DetalleVentas, {
          variante,
          producto: variante.producto,
          cantidad: item.cantidad,
          precio: precioUnitario,
          subtotal,
        });

        detallesAGuardar.push(detalle);
      }

      const nuevaVenta = manager.create(Venta, {
        usuario: usuarioExistente?.email ? { id: usuarioExistente.id } : undefined,
        nombreClienteCasual: nombre,
        apellidoClienteCasual: apellido,
        emailClienteCasual: email,
        total: totalVenta,
        metodoPago: MetodoPago.EFECTIVO,
        estado: EstadoVenta.CONCRETADA,
      });

      const ventaGuardada = await manager.save(Venta, nuevaVenta);

      for (const detalle of detallesAGuardar) {
        detalle.venta = ventaGuardada;
        await manager.save(DetalleVentas, detalle);
      }

      return await manager.findOne(Venta, {
        where: { id: ventaGuardada.id },
        relations: {
          detalle_venta: {
            producto: true,
            variante: true,
          },
          usuario: true,
        },
      });
    });
  }

  async crearVentaMercadoPago(ventaDto: VentaMercadoPagoDto, usuarioId: string) {
    const dbResult = await this.dataSource.transaction(async (manager) => {
      const usuario = await manager.findOne(Usuarios, { where: { id: usuarioId } });
      if (!usuario) throw new NotFoundException('Usuario no encontrado.');

      let precioTotal = 0;
      const detallesAGuardar: DetalleVentas[] = [];
      const mpItemsPreferencias: { id: string; nombre: string; cantidad: number; precio: number }[] = [];

      for (const productoItem of ventaDto.items) {
        const producto = await manager.findOne(Productos, { where: { id: productoItem.productoId } });
        if (!producto) throw new NotFoundException(`Producto ID ${productoItem.productoId} no encontrado.`);

        const variante = await manager.findOne(Variantes, { where: { id: productoItem.varianteId } });
        if (!variante) throw new NotFoundException(`Variante ID ${productoItem.varianteId} no encontrada.`);

        if (productoItem.cantidad > variante.stock) {
          throw new BadRequestException(`No hay stock suficiente para ${producto.nombre}`);
        }

        const subtotalItem = Number(productoItem.cantidad) * Number(variante.precio);
        precioTotal += subtotalItem;

        const detalle = manager.create(DetalleVentas, {
          producto,
          variante,
          cantidad: Number(productoItem.cantidad),
          precio: Number(variante.precio),
          subtotal: subtotalItem,
        });

        detallesAGuardar.push(detalle);

        mpItemsPreferencias.push({
          id: producto.id,
          nombre: `${producto.nombre} - ${producto.marca || ''}`,
          cantidad: Number(productoItem.cantidad),
          precio: Number(variante.precio),
        });
      }

      const nuevaVenta = manager.create(Venta, {
        usuario: usuario,
        total: precioTotal,
        metodoPago: MetodoPago.MERCADO_PAGO,
        estado: EstadoVenta.PENDIENTE_PAGO,
      });

      const ventaGuardada = await manager.save(Venta, nuevaVenta);

      for (const detalle of detallesAGuardar) {
        detalle.venta = ventaGuardada;
        await manager.save(DetalleVentas, detalle);
      }

      return { ventaGuardada, mpItemsPreferencias };
    });

    const { ventaGuardada, mpItemsPreferencias } = dbResult;

    const initPoint = await this.mercadoPagoService.crearPreferencia(
      ventaGuardada.id,
      mpItemsPreferencias,
    );

    return {
      message: 'Preferencia de pago generada correctamente.',
      ventaId: ventaGuardada.id,
      initPoint,
    };
  }

  async procesarPagoAprobadoMP(ventaId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id: ventaId },
        relations: {
          usuario: true,
          detalle_venta: {
            variante: true,
          },
        },
      });

      if (!venta) throw new NotFoundException('Venta no encontrada.');

      if (venta.estado === EstadoVenta.CONCRETADA) {
        return { message: 'La venta ya fue procesada previamente.' };
      }

      for (const detalle of venta.detalle_venta) {
        const variante = await manager.findOne(Variantes, {
          where: { id: detalle.variante.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!variante) {
          throw new NotFoundException(`Variante no encontrada.`);
        }

        if (variante.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para la variante ID ${variante.id}`,
          );
        }

        variante.stock -= detalle.cantidad;
        await manager.save(Variantes, variante);
      }

      venta.estado = EstadoVenta.CONCRETADA;
      const ventaActualizada = await manager.save(Venta, venta);

      console.log(`Venta ${ventaId} `);
      return {
        message: 'Pago procesado y stock descontado.',
        venta: ventaActualizada,
      };
    });
  }

}