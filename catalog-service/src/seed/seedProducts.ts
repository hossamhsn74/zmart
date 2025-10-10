import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

const seedProducts = async () => {
  await AppDataSource.initialize();
  const productRepo = AppDataSource.getRepository(Product);

  const products: Product[] = [];
  for (let i = 0; i < 200; i++) {
    const p = new Product();
    p.title = faker.commerce.productName();
    p.brand = faker.company.name();
    p.category = faker.commerce.department();
    p.price = parseFloat(faker.commerce.price());
    p.tags = [
      faker.commerce.productAdjective(),
      faker.commerce.productMaterial(),
    ];
    p.image_url = faker.image.url();
    p.stock = faker.number.int({ min: 0, max: 100 });
    p.attributes = {
      material: faker.commerce.productMaterial(),
      weight: faker.number.float({ min: 0.1, max: 10 }),
    };
    products.push(p);
  }

  await productRepo.save(products);
  console.log("✅ Seeded 200 products");
  process.exit(0);
};

seedProducts();
