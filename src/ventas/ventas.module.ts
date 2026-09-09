import { forwardRef, Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productos } from '../productos/entities/producto.entity';
import { Variantes } from '../variantes/entities/variantes.entity';
import { Venta } from './entities/venta.entity';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { DetalleVentas } from '../detalle_ventas/entities/detalle_ventas.entity';
import { MercadoPagoModule } from '../mercado_pago/mercado_pago.module';
import { VentasRepository } from './ventas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Productos, Variantes, Venta, Usuarios, DetalleVentas]),
  forwardRef(()=> MercadoPagoModule)],
  controllers: [VentasController],
  providers: [VentasService, VentasRepository],
  exports: [VentasService]
})
export class VentasModule {}
