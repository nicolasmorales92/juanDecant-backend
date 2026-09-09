import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { UpdateVentasDetalleDto } from './dto/update-ventas_detalle.dto';
import { DetalleVentasService } from './detalle_ventas.service';
import { CrearDellateVentaDto } from './dto/crear.detalle_venta.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decoradores/decorador.roles';
import { RolesEnum } from '../usuarios/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';

@Controller('ventas-detalles')
export class DetalleVentasController {
  constructor(private readonly ventasDetallesService: DetalleVentasService) {}

  @ApiBearerAuth()
  @Roles(RolesEnum.USUARIO)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async create(@Body() crearDetalleVentaDto: CrearDellateVentaDto, @Req() req: any) {
    const usuarioId = req.usuarios.id
    console.log(req.usuarios.nombre)
    return await this.ventasDetallesService.crear(crearDetalleVentaDto, usuarioId);
  }

  @Get() 
  findAll() {
    return this.ventasDetallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasDetallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentasDetalleDto: UpdateVentasDetalleDto) {
    return this.ventasDetallesService.update(+id, updateVentasDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasDetallesService.remove(+id);
  }
}
