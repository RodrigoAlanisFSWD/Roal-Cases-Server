import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import {Product} from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async saveProduct(product: Product) {
    const newProduct = this.productRepo.create(product);

    return this.productRepo.save(newProduct);
  }

  async getProductById(id: number) {
    return this.productRepo.findOne({
      where: {
        id,
      },
      relations: {
        subCategories: true,
        category: true,
        images: true,
      },
    });
  }

  async findProduct(options: FindOneOptions<Product>) {
    return this.productRepo.findOne(options);
  }

  async findProducts(options: FindOneOptions<Product>) {
    return this.productRepo.find(options);
  }

  async getProducts() {
    return this.productRepo.find({
      relations: {
        category: true,
        subCategories: true,
      },
    });
  }

  async deleteProduct(productId: number) {
    return this.productRepo.delete({
      id: productId,
    });
  }

  async updateProduct(product: Product) {
    return this.productRepo.save(product);
  }
}
