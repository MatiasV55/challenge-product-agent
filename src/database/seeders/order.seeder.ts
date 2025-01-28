import { OrderStatus } from 'src/order/entities/order.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product/entities/productOrder.entity';
import MigrationsDataSource from '../data-source';

export const orderSeeder = async () => {
  const orderRepository = MigrationsDataSource.getRepository(Order);
  const productRepository = MigrationsDataSource.getRepository(Product);

  const generateAlphanumericId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const product1 = await productRepository.findOneBy({
    name: 'Llantas 16" Marca Michelin',
  });
  const product2 = await productRepository.findOneBy({
    name: 'Aceite Sintético 5W-30',
  });
  const product3 = await productRepository.findOneBy({
    name: 'Batería de Auto 12V',
  });
  const product4 = await productRepository.findOneBy({
    name: 'Limpiaparabrisas Bosch 22"',
  });
  const product5 = await productRepository.findOneBy({
    name: 'Freno de Disco para Ford Focus',
  });
  const product6 = await productRepository.findOneBy({
    name: 'Filtro de Aire para Toyota Corolla',
  });

  if (
    !product1 ||
    !product2 ||
    !product3 ||
    !product4 ||
    !product5 ||
    !product6
  ) {
    console.error('Products not found');
    return;
  }

  const order1 = new Order();
  order1.status = OrderStatus.PENDING;
  order1.trackingId = generateAlphanumericId();

  const productOrder1 = new ProductOrder();
  productOrder1.quantity = 4;
  productOrder1.product = product1;
  productOrder1.order = order1;

  const productOrder2 = new ProductOrder();
  productOrder2.quantity = 5;
  productOrder2.product = product2;
  productOrder2.order = order1;

  const productOrder3 = new ProductOrder();
  productOrder3.quantity = 2;
  productOrder3.product = product3;
  productOrder3.order = order1;

  const order2 = new Order();
  order2.status = OrderStatus.IN_PROGRESS;
  order2.trackingId = generateAlphanumericId();

  const productOrder4 = new ProductOrder();
  productOrder4.quantity = 3;
  productOrder4.product = product4;
  productOrder4.order = order2;

  const productOrder5 = new ProductOrder();
  productOrder5.quantity = 2;
  productOrder5.product = product5;
  productOrder5.order = order2;

  const productOrder6 = new ProductOrder();
  productOrder6.quantity = 6;
  productOrder6.product = product6;
  productOrder6.order = order2;

  order1.productOrders = [productOrder1, productOrder2, productOrder3];
  order2.productOrders = [productOrder4, productOrder5, productOrder6];

  await orderRepository.save([order1, order2]);

  console.log('Orders created successfully');
};
