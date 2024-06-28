import { SetMetadata } from '@nestjs/common'

export const NoGuard = () => SetMetadata('no-guard', true)
