import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const UserContext = createParamDecorator(
  (key: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    if (!key) return request.user

    return request.user[key]
  },
)
