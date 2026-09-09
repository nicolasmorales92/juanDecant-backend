import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token no encontrado.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (!payload.rol) {
                throw new UnauthorizedException('El token no contiene un rol de usuario válido');
            }
            payload.rol = [payload.rol]
            request.usuario = payload


        }
        catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
        return true;
    }
}
