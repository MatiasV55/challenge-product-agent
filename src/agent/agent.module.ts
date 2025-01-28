import { Module } from '@nestjs/common';

import { AgentService } from './services/agent.service';
import { AgentController } from './controllers/agent.controller';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [MessageModule, OrderModule, ProductModule],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
