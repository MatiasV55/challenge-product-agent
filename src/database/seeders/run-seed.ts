import MigrationsDataSource from '../data-source';
import { orderSeeder } from './order.seeder';
import { productSeeder } from './product.seeder';

async function run() {
  try {
    await MigrationsDataSource.initialize();
    console.log('Database connected.');

    await productSeeder();
    await orderSeeder();

    console.log('Seed data inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

run();
