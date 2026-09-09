import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../auth/decoradores/decorador.roles';
import { RolesEnum } from './enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}


  
  @ApiQuery({ name: 'page', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async verUsuarios(
      @Query('page') page?: string,
      @Query('limit') limit?: string,
  ) {
    const pageValid = Number(page) > 0 ? Number(page) : 1
    const limitValid = Number(limit) > 0 ? Number(limit) : 10

    return await this.usuariosService.verUsuarios(pageValid, limitValid);
  }

@ApiBearerAuth()
  @Roles(RolesEnum.USUARIO, RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('mi-perfil')
  async getPerfil(@Req() req: any) {
    const usuarioId = req.usuario.id; 
    return await this.usuariosService.findById(usuarioId);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.USUARIO, RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('mi-perfil')
  @ApiBody({ type: UpdateUsuarioDto })
  async updateMiPerfil(
    @Req() req: any,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    console.log(req.usuario)
    const usuarioId = req.usuario.id;
    return await this.usuariosService.update(usuarioId, updateUsuarioDto);
  }


  @ApiParam({name: 'id', type: 'string'})
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usuariosService.findById(id);
  }



  @ApiBearerAuth()
  @Roles(RolesEnum.USUARIO)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
