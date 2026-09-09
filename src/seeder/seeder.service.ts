import productos from '../dataproductos.helper.json'
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Productos } from '../productos/entities/producto.entity';
import { Variantes } from '../variantes/entities/variantes.entity';
import { GeneroEnum } from '../productos/enum´s/genero.enum';


@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Productos)
    private readonly repositoryProductos: Repository<Productos>,
    @InjectRepository(Variantes)
    private readonly repositoryVariantes: Repository<Variantes>
  ) { }
  private mayuscula(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  async seederProductos() {
    for (const perfume of productos) {
      try {
        const productoExistente = await this.repositoryProductos.findOne({
          where: {
            nombre: perfume.nombre,
            marca: perfume.marca
          }
        })
        if (productoExistente) throw new ConflictException(`El producto ${perfume.nombre} ya existe, saltando...`);

        if(perfume.imagenes){
          
        }

        const nuevoProducto = {
          nombre: perfume.nombre,
          marca: perfume.marca,
          genero: GeneroEnum[perfume.genero as keyof typeof GeneroEnum],
          descripcion: perfume.descripcion,
          imagenes: perfume.imagenes,
          variantes: perfume.variantes.map((variante)=>({
            stock: (variante.stock),
            mililitros: variante.mililitros,
            precio: variante.precio
          }))
        }

        await this.repositoryProductos.save(nuevoProducto)
      }
      catch (error) {
        console.log(error)
      }
    }
  console.log('seeder completado.')
  }
}
