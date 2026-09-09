import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductosRepository } from './productos.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Productos } from './entities/producto.entity';
import { ILike, Not, Repository } from 'typeorm';
import { GeneroEnum } from './enum´s/genero.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductosService {
  constructor(
    private readonly productosRepository: ProductosRepository,
    @InjectRepository(Productos)
    private readonly productosRepo: Repository<Productos>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  async crear(createProductoDto: CreateProductoDto, imagen: Express.Multer.File) {
    if (imagen) {
      const urlImagen = await this.cloudinaryService.subirImagen(imagen)
      createProductoDto.imagenes = [urlImagen]
    }
    return await this.productosRepository.crear(createProductoDto)
  }

  async buscar(page?: number, limit?: number, search?: string) {
    if (page && limit) {
      const skip = (page - 1) * limit
      const take = limit

      return await this.productosRepository.buscar(skip, take, search)
    }

    return await this.productosRepository.buscar()
  }


  async getById(id: string) {
    const producto = await this.productosRepository.getById(id)
    if (!producto) throw new NotFoundException('No se encontró el producto.')

    return producto
  }


  async buscarPorGenero(genero: string,  page?: number, limit?: number, search?: string ) {
    if (page && limit) {
      const skip = (page - 1) * limit
      const take = limit

      return await this.productosRepository.buscarPorCategoria(genero, skip, take, search)
    }

    return await this.productosRepository.buscarPorCategoria(genero)
}




  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productosRepository.getById(id)
    if (!producto) throw new NotFoundException('El producto no existe.')

    const nombre = updateProductoDto.nombre || producto.nombre
    const marca = updateProductoDto.marca || producto.marca
    const genero = updateProductoDto.genero || producto.genero

    if (updateProductoDto.nombre || updateProductoDto.marca || updateProductoDto.genero) {

      const productoDuplicado = await this.productosRepo.findOne({
        where: {
          nombre: ILike(nombre),
          marca: ILike(marca),
          genero: genero as GeneroEnum,
          id: Not(id)
        }
      });

      if (productoDuplicado) {
        throw new BadRequestException(
          `Ya existe otro producto de la marca '${marca}' con el nombre '${nombre}'.`
        );
      }
    }
    return await this.productosRepository.update(id, updateProductoDto)
  }

  async eliminar(id: string) {
    const producto = await this.productosRepository.getById(id)
    if (!producto) throw new NotFoundException('El producto no existe.')

    return await this.productosRepository.eliminar(id)
  }
}

