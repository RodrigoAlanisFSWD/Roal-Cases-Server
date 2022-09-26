import { Injectable } from '@nestjs/common';
import {ProductService} from "./product/product.service";
import {Product} from "./product/product.entity";
import { CategoryService } from '../categories/category/category.service';
import fs, { existsSync, rm, rmSync } from 'fs';
import { join, parse } from 'path';
import { ProductImage } from './image/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uid} from 'uuid';

@Injectable()
export class ProductsService {

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        @InjectRepository(ProductImage) 
        private imageRepo: Repository<ProductImage>
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

    async uploadProductImage(image: Express.Multer.File, productImage: ProductImage): Promise<Product> {
        const product = await this.productService.getProductById(productImage.product.id);
        const ext = parse(image.originalname).ext;

        if (productImage.type === "MAIN") {
            const oldMain = product.images.find((img: ProductImage) => img.type === "MAIN")

            if (oldMain) {
                const fileName = oldMain.imageUrl.split("/files/products/")[1]
                const path = join(__dirname, "../../public/img/products/" + fileName)
                if (existsSync(path)) {
                    rmSync(path)
                }
            }
        }

        productImage.imageUrl = `http://localhost:8080/files/products/${uid()}${ext}`

        const newImage = await this.imageRepo.save(productImage)

        product.images.push(newImage)

        return this.productService.updateProduct(product);
    }
}
