import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { GeneroEnum } from "./enum´s/genero.enum";
import { UpdateProductoDto } from "./dto/update-producto.dto";

@Injectable()
export class ProductosRepository {
    constructor(
        @InjectRepository(Productos)
        private readonly productosRepository: Repository<Productos>
    ) { }
    async crear(createProductoDto: CreateProductoDto) {
        const productoExistente = await this.productosRepository.findOne({
            where: {
                nombre: createProductoDto.nombre,
                marca: createProductoDto.marca,
                genero: createProductoDto.genero as GeneroEnum
            }
        })

        if (productoExistente) throw new BadRequestException('El producto ya existe')

        const nuevoProducto = {
            nombre: createProductoDto.nombre,
            marca: createProductoDto.marca,
            genero: createProductoDto.genero,
            descripcion: createProductoDto.descripcion,
            imagenes: createProductoDto.imagenes,
            variantes: createProductoDto.variantes.map((vari) => ({
                stock: (vari.stock),
                mililitros: vari.mililitros,
                precio: vari.precio
            }))
        }
        return await this.productosRepository.save(nuevoProducto)
    }

    async buscar(skip?: number, take?: number, search?: string) {
        const queryBuilder = this.productosRepository.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.variantes', 'variantes')
            .skip(skip)
            .take(take)
            .orderBy('producto.id', 'ASC');

        if (search) {
            queryBuilder.where(
                'producto.nombre ILIKE :search OR producto.marca ILIKE :search',
                { search: `%${search}%` }
            );
        }

        return await queryBuilder.getMany();
    }


    async buscarPorCategoria(genero: string, page: number = 1, limit: number = 6, search?: string) {
        const pageValid = Math.max(1, Number(page) || 1);
        const limitValid = Math.max(1, Number(limit) || 6);
        const skip = (pageValid - 1) * limitValid;

        const generoFormateada = genero.toLowerCase() as GeneroEnum;

        const queryBuilder = this.productosRepository.createQueryBuilder('producto')
            .leftJoinAndSelect('producto.variantes', 'variantes')
            .where('producto.genero = :genero', { genero: generoFormateada })
            .skip(skip)
            .take(limitValid)
            .orderBy('producto.id', 'ASC');

        if (search) {
            queryBuilder.andWhere(
                '(producto.nombre ILIKE :search OR producto.marca ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        return await queryBuilder.getMany();
    }



    async getById(id: string) {
        return await this.productosRepository.findOne({
            where: { id: id },
            relations: { variantes: true }
        })
    }




    async buscarPorPrecio(min: number, max: number) {
        return await this.productosRepository.find({
            relations: {
                variantes: true
            },
            where: {
                variantes: {
                    precio: Between(min, max)
                }
            }
        })
    }



    async update(id: string, updateProductoDto: UpdateProductoDto) {
        const producto = await this.productosRepository.findOne({
            where: { id: id },
            relations: {
                variantes: true
            }
        })
        if (!producto) throw new NotFoundException('Producto no encontrado')

        for (const key in updateProductoDto) {
            if (updateProductoDto[key] !== undefined) {
                producto[key] = updateProductoDto[key]
            }
        }

        return await this.productosRepository.save(producto)
    }


    async eliminar(id: string) {
        return await this.productosRepository.delete(id)
    }

}