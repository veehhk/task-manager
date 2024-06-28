import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'
import { AuthGuard } from '@nestjs/passport'
import { Observable, catchError, tap } from 'rxjs'
import { QUEUE_AUTHENTICATION } from '../queue/queue.constant'
import { MESSAGE_AUTHORIZE } from '../literals/message.constant'

@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {
  constructor(
    private reflector: Reflector,
    @Inject(QUEUE_AUTHENTICATION) private authorizer: ClientProxy,
  ) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isNoGuard = this.reflector.getAllAndOverride<boolean>('no-guard', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isNoGuard) {
      return true
    }
    this.authorizer.send(MESSAGE_AUTHORIZE, this.getToken(context)).pipe(
      tap((response) => {
        this.addUser(response, context)
      }),
      catchError((error) => {
        throw new UnauthorizedException(error)
      }),
    )
    return super.canActivate(context)
  }

  private getToken(context: ExecutionContext): any {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      return request.headers.authorization
    } else if (context.getType() === 'rpc') {
      const request = context.switchToRpc().getContext() //getData();
      return request.headers.authorization
    }
  }

  private addUser(response: any, context: ExecutionContext) {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      request.user = response
    } else if (context.getType() === 'rpc') {
      const request = context.switchToRpc().getContext() //getData();
      request.user = response
    }
  }
}
