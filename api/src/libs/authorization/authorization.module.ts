import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AccessTokenStrategy } from './strategies/access.token.strategy'

@Module({
  imports: [],
  exports: [],
})
export class AuthorizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessTokenStrategy).forRoutes('*')
  }
}
