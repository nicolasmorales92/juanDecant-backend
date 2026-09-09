import { ApiProperty } from '@nestjs/swagger';

class MercadoPagoDto {
  @ApiProperty({ example: '1234567890', description: 'ID del pago generado en Mercado Pago' })
  id: string;
}

export class MercadoPagoNotificacionDto {
  @ApiProperty({ example: 'payment', description: 'Tipo de evento enviado por Mercado Pago' })
  type: string;

  @ApiProperty({ type: () => MercadoPagoDto, description: 'Datos adicionales del evento' })
  data: MercadoPagoDto;
}