import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NatsOptions, Transport } from '@nestjs/microservices'

@Injectable()
export class QueueService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string): NatsOptions {
    return {
      transport: Transport.NATS,
      options: {
        servers: [this.configService.get<string>('NATS_URI')],
        queue: this.configService.get<string>(`MIO_${queue}_QUEUE`),
      },
    }
  }
}
