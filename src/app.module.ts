import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { VariantesModule } from './variantes/variantes.module';
import { DetalleVentasModule } from './detalle_ventas/detalle_ventas.module';
import { SeederModule } from './seeder/seeder.module';
import { Productos } from './productos/entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Variantes } from './variantes/entities/variantes.entity';
import { Usuarios } from './usuarios/entities/usuarios.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Venta } from './ventas/entities/venta.entity';
import { DetalleVentas } from './detalle_ventas/entities/detalle_ventas.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MercadoPagoModule } from './mercado_pago/mercado_pago.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [Productos, Variantes, Usuarios, Venta, DetalleVentas],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ProductosModule,
    UsuariosModule,
    VentasModule,
    VariantesModule,
    DetalleVentasModule,
    SeederModule,
    AuthModule,
    CloudinaryModule,
    MercadoPagoModule,
  ],
})
export class AppModule {}