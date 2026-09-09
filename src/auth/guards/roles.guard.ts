import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesEnum } from "../../usuarios/enums/roles.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<RolesEnum[]>('rol', [
      context.getHandler(),
      context.getClass() 
    ])

    const request = context.switchToHttp().getRequest()
    const usuario = request.usuario

    const validRole = ()=> requiredRole.some((rol) => usuario.rol.includes(rol))

    if(!validRole()) {throw new UnauthorizedException('No tienes permiso para acceder a esta ruta.')}
    return true
  }
}