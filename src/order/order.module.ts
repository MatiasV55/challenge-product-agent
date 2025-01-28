import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { ProductOrder } from 'src/product/entities/productOrder.entity';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Order, ProductOrder])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
