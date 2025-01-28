import { Product } from 'src/product/entities/product.entity';
import MigrationsDataSource from '../data-source';

export const productSeeder = async () => {
  const productRepository = MigrationsDataSource.getRepository(Product);

  const product1 = new Product();
  product1.name = 'Llantas 16" Marca Michelin';
  product1.quantity = 50;

  const product2 = new Product();
  product2.name = 'Aceite Sintético 5W-30';
  product2.quantity = 100;

  const product3 = new Product();
  product3.name = 'Batería de Auto 12V';
  product3.quantity = 30;

  const product4 = new Product();
  product4.name = 'Limpiaparabrisas Bosch 22"';
  product4.quantity = 40;

  const product5 = new Product();
  product5.name = 'Freno de Disco para Ford Focus';
  product5.quantity = 25;

  const product6 = new Product();
  product6.name = 'Filtro de Aire para Toyota Corolla';
  product6.quantity = 60;

  await productRepository.save([
    product1,
    product2,
    product3,
    product4,
    product5,
    product6,
  ]);

  console.log('Products created successfully');
};
