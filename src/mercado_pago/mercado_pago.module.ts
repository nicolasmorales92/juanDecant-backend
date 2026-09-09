import { forwardRef, Module } from '@nestjs/common';
import { MercadoPagoController } from './mercado_pago.controller';
import { MercadoPagoService } from './mercado_pago.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { VentasModule } from '../ventas/ventas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venta]), 
  forwardRef(()=> VentasModule)],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService]
})
export class MercadoPagoModule {}
