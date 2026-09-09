import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { ProductosRepository } from './productos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productos } from './entities/producto.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Productos]), CloudinaryModule],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosRepository],
  exports: [ProductosRepository]
})
export class ProductosModule {}
