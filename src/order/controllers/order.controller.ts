import { Controller, HttpException, HttpStatus, Get } from '@nestjs/common';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('tracking-ids')
  async getExistingOrdersTrackingIds() {
    try {
      const response = await this.orderService.getExistingOrdersTrackingIds();
      return response;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
