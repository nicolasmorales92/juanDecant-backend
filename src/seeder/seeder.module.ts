import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productos } from '../productos/entities/producto.entity';
import { Variantes } from '../variantes/entities/variantes.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Productos, Variantes]), CloudinaryModule],
  providers: [SeederService],
})
export class SeederModule {}
