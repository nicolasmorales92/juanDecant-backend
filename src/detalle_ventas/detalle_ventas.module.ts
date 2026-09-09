import { Module } from '@nestjs/common';
import { DetalleVentasController } from './detalle_ventas.controller';
import { DetalleVentasService } from './detalle_ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productos } from '../productos/entities/producto.entity';
import { Variantes } from '../variantes/entities/variantes.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { DetalleVentas } from './entities/detalle_ventas.entity';
import { VentasService } from '../ventas/ventas.service';
import { VentasModule } from '../ventas/ventas.module';


@Module({
  imports: [TypeOrmModule.forFeature([DetalleVentas]), VentasModule],
  controllers: [DetalleVentasController],
  providers: [DetalleVentasService],
})
export class DetalleVentasModule {}
