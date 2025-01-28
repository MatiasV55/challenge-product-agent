import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrderByTrackingId(trackingId: string): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { trackingId },
      relations: ['productOrders', 'productOrders.product'],
    });
  }

  async getExistingOrdersTrackingIds(): Promise<string[]> {
    const orders = await this.orderRepository.find();
    return orders.map((order) => order.trackingId);
  }
}
