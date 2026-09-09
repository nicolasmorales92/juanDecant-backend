import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private mpClient: MercadoPagoConfig;

  constructor() {
    const accessToken = process.env.TOKEN_MP;
    if (!accessToken) {
      throw new Error('TOKEN_MP no está configurado en las variables de entorno.');
    }
    this.mpClient = new MercadoPagoConfig({ accessToken });
  }

  async crearPreferencia(
    ventaId: string,
    itemsCarrito: { id: string; nombre: string; cantidad: number; precio: number }[]
  ) {
    const preference = new Preference(this.mpClient);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL;

    const bodyPreference: any = {
      items: itemsCarrito.map((item) => ({
        id: item.id,
        title: item.nombre,
        quantity: Number(item.cantidad),
        unit_price: Number(item.precio),
        currency_id: 'ARS',
      })),
      external_reference: ventaId,
      back_urls: {
        success: `${frontendUrl}/checkout/resultado?status=success`,
        failure: `${frontendUrl}/checkout/resultado?status=failure`,
        pending: `${frontendUrl}/checkout/resultado?status=pending`,
      },
    };

    if (frontendUrl.startsWith('https://')) {
      bodyPreference.auto_return = 'approved';
    }

    if (backendUrl) {
      const cleanBackendUrl = backendUrl.replace(/\/$/, '');
      bodyPreference.notification_url = `${cleanBackendUrl}/payments/webhook`;
    }

    try {
      const response = await preference.create({ body: bodyPreference });
      return response.init_point;
    } catch (error: any) {
      console.error('Error al crear preferencia en Mercado Pago:', error?.cause || error);
      throw new InternalServerErrorException('Error al generar la preferencia de pago.');
    }
  }

  async obtenerDetallesPago(paymentId: string) {
    const payment = new Payment(this.mpClient);
    try {
      const datosPago = await payment.get({ id: paymentId });
      return {
        estado: datosPago.status,
        ventaId: datosPago.external_reference,
      };
    } catch (error) {
      console.error('Error al consultar el pago en Mercado Pago:', error);
      throw new InternalServerErrorException('Error al verificar el estado del pago.');
    }
  }
}