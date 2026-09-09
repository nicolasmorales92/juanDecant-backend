import { PartialType } from '@nestjs/swagger';
import { CrearUsuarioDTO } from '../../auth/dto/create-auth.dto';

export class UpdateUsuarioDto extends PartialType(CrearUsuarioDTO) {}