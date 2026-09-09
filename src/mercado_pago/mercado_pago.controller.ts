import { Controller, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MercadoPagoService } from './mercado_pago.service';
import { VentasService } from '../ventas/ventas.service';
import { MercadoPagoNotificacionDto } from '../ventas/dto´s/pagoConMercagoPago.dto';

@ApiTags('Payments')
@Controller('payments')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly ventasService: VentasService,
  ) { }

  @ApiQuery({ name: 'type', required: false, example: 'payment' })
  @ApiQuery({ name: 'data.id', required: false, example: '1234567890' })
  @ApiBody({ type: MercadoPagoNotificacionDto })
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async recibirNotificacion(@Query() query: any, @Body() body: any) {
    const tipo = query.type || query.topic || body.type || body.action;

    const paymentId = query['data.id'] || query.id || (body.data && body.data.id);


    const esEventoDePago = [
      'payment',
      'payment.created',
      'payment.updated',
      'merchant_order'
    ].includes(tipo);

    if (esEventoDePago && paymentId) {
      try {
        const { estado, ventaId } = await this.mercadoPagoService.obtenerDetallesPago(String(paymentId));

        console.log(`webhook Estado del pago ${paymentId}: ${estado} | venta ID: ${ventaId}`);

        if (estado === 'approved' && ventaId) {
          const resultado = await this.ventasService.procesarPagoAprobadoMP(ventaId);
          console.log(`webhook exito: Stock descontado para la venta ${ventaId}`, resultado);
        }
      } catch (error) {
        console.error(`[Webhook MP] Error al procesar pago ${paymentId}:`, error);
      }
    }

    return { recibido: true };
  }
}