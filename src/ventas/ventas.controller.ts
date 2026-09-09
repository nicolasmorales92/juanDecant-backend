import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentaMercadoPagoDto } from './dto´s/ventaMercadoPagodto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../auth/decoradores/decorador.roles';
import { RolesEnum } from '../usuarios/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { CrearVentaEfectivoDto } from './dto´s/ventasEfectivo.dto';


@Controller('ventas')
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
  ) { }


  @ApiQuery({ name: 'page', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async verVentasAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string) {
    
    const pageValid = Number(page) > 0 ? Number(page) : 1
    const limitValid = Number(limit) > 0 ? Number(limit) : 10


    return await this.ventasService.verVentasAdmin(pageValid, limitValid)
  }




  
  @ApiQuery({ name: 'page', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiBearerAuth()
  @Roles(RolesEnum.USUARIO)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('compras')
  async verVentasUsuario(
    @Req() request: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string) {
    const userId = request.usuario.id
    console.log(userId)
    const pageValid = Number(page) > 0 ? Number(page) : 1
    const limitValid = Number(limit) > 0 ? Number(limit) : 10

    return await this.ventasService.verVentasUsuario(userId, pageValid, limitValid)
  }



  @ApiParam({ name: 'id', type: 'string' })
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async verVentasById(@Param('id') id:string) {
    return await this.ventasService.verVentasById(id)
  }



  @ApiBearerAuth()
  @Roles(RolesEnum.USUARIO)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/mercadopago')
  async crearVentaMercadoPago(@Body() crearVentaDto: VentaMercadoPagoDto, @Req() req: any) {
    const usuarioId = req.usuario.id
    return await this.ventasService.crearVentaMercadoPago(crearVentaDto, usuarioId);
  }


  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('efectivo')
  async crearVentaEfectivo(@Body() dto: CrearVentaEfectivoDto) {
    return await this.ventasService.crearVentaEfectivo(dto);
  }


}
