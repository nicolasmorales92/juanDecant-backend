import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../auth/decoradores/decorador.roles';
import { RolesEnum } from '../usuarios/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }


  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  @Post('nuevo')
  async crear(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() imagen: Express.Multer.File
  ) {
    const nuevoProducto = await this.productosService.crear(createProductoDto, imagen);
    
    return {
      message: `${nuevoProducto.nombre} creado exitosamente.`
    }
  }

  @ApiQuery({ name: 'page', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @Get()
  async buscarProductos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string) {
    const pageValid = Number(page) > 0 ? Number(page) : 1
    const limitValid = Number(limit) > 0 ? Number(limit) : 6


    return await this.productosService.buscar(pageValid, limitValid, search);
  }


  @ApiParam({ name: 'genero', type: 'string' })
  @ApiQuery({ name: 'page', required: false, type: 'string' })
  @ApiQuery({ name: 'limit', required: false, type: 'string' })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @Get('genero/:genero')
  async buscarPorGenero(
    @Param('genero') genero: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageValid = Number(page) > 0 ? Number(page) : 1
    const limitValid = Number(limit) > 0 ? Number(limit) : 6
    return await this.productosService.buscarPorGenero(genero, pageValid, limitValid, search);
  }



  @ApiParam({name: 'id', type: 'string'})
  @Get(':id')
  async getById(@Param('id',ParseUUIDPipe ) id: string){
    return await this.productosService.getById(id)
  }



  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    const productoActualizado = await this.productosService.update(id, updateProductoDto);
    return {
      message: `Se actualizó el producto ${productoActualizado.nombre}.`
    }
  }


  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const productoEliminado = await this.productosService.eliminar(id);
    return {
      message: `Se eliminó el producto correctamente.`
    }
  }
}
