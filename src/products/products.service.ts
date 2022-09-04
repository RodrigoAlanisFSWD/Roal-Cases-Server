import { Injectable } from '@nestjs/common';
import {ProductService} from "./product/product.service";
import {Product} from "./product/product.entity";
import { CategoryService } from '../categories/category/category.service';

@Injectable()
export class ProductsService {

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) {
    }

    async getProducts(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    async getProduct(productId: number): Promise<Product> {
        const product = await this.productService.getProductById(productId);

        return product;
    }

    async createProduct(product: Product, categoryId: number): Promise<Product> {
        const category = await this.categoryService.getCategoryById(categoryId);
        product.category = category;
        const newProduct = await this.productService.saveProduct(product);

        return newProduct
    }

    async updateProduct(product: Product): Promise<Product> {
        const updatedProduct = await this.productService.updateProduct(product)

        return updatedProduct;
    }

    async deleteProduct(productId: number): Promise<any> {
        return this.productService.deleteProduct(productId)
    }

    async uploadProductImage(image: Express.Multer.File, productId: number): Promise<Product> {
        const product = await this.productService.getProductById(productId);

        product.imageUrl = `http://localhost:8080/files/products/${image.filename}`

        return this.productService.updateProduct(product);
    }
}
