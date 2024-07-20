import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces';
import { AppContext } from '../interfaces/context';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly CONTEXT: string = 'context';

  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.verifyJwt(request);
  }

  async verifyJwt(req: any) {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken) {
      throw new ForbiddenException('No token provided');
    }
    const token = authorizationToken.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Malformed token');
    }
    try {
      const decoded = await this.verifyToken(token);
      req[AuthGuard.CONTEXT] = new AppContext(decoded);
      req.user = decoded;
      return true;
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded as JwtPayload);
          }
        },
      );
    });
  }
}
