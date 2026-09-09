import { PartialType } from '@nestjs/swagger';
import { CrearDellateVentaDto } from './crear.detalle_venta.dto';

export class UpdateVentasDetalleDto extends PartialType(CrearDellateVentaDto) {}
