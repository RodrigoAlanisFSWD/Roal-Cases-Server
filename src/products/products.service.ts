import { Injectable } from '@nestjs/common';
import {ProductService} from "./product/product.service";
import {Product} from "./product/product.entity";
import { CategoryService } from '../categories/category/category.service';
import fs, { existsSync, rmSync } from 'fs';
import { join, parse } from 'path';

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
        const ext = parse(image.originalname).ext;

        if (product.imageUrl !== null) {
            const fileName = product.id + ext
            const path = join(__dirname, "../../public/products/" + fileName)
            if (existsSync(path)) {
                rmSync(path)
            }
        }

        product.imageUrl = `http://localhost:8080/files/categories/${product.id}${ext}`

        return this.productService.updateProduct(product);
    }
}
