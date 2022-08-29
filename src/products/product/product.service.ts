import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOneOptions, Repository} from "typeorm";
import {Product} from "./product.entity";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>
    ) {
    }

    async saveProduct(product: Product) {
        const newProduct = this.productRepo.create(product);

        return this.productRepo.save(newProduct);
    }

    async getProductById(id: number) {
        return this.productRepo.findOneBy({
            id,
        })
    }

    async findProduct(options: FindOneOptions<Product>) {
        return this.productRepo.findOne(options);
    }

    async findProducts(options: FindOneOptions<Product>) {
        return this.productRepo.find(options);
    }

    async getProducts() {
        return this.productRepo.find();
    }

    async deleteProduct(product: Product) {
        return this.productRepo.delete({
            id: product.id,
        })
    }

    async updateProduct(product: Product) {
        return this.productRepo.save(product)
    }

}