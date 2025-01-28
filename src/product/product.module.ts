import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductOrder } from './entities/productOrder.entity';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductOrder])],
  controllers: [],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
