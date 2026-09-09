import { SetMetadata } from "@nestjs/common"
import { RolesEnum } from "../../usuarios/enums/roles.enum"

export const Roles = (...roles: RolesEnum[]) => SetMetadata('rol', roles)