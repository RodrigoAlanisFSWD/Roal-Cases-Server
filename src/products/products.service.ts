import { Injectable } from '@nestjs/common';
import { ProductService } from "./product/product.service";
import { Product } from "./product/product.entity";
import { CategoryService } from '../categories/category/category.service';
import fs, { existsSync, rm, rmSync } from 'fs';
import { join, parse } from 'path';
import { ProductImage } from './image/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, createQueryBuilder, In, Like, Repository } from 'typeorm';
import { v4 as uid } from 'uuid';
import { toSlug } from 'src/common/utils/functions';
import { SearchDTO } from './search';
import { SubCategory } from 'src/subcategories/subcategory/subcategory.entity';

@Injectable()
export class ProductsService {

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        @InjectRepository(ProductImage)
        private imageRepo: Repository<ProductImage>,
    ) {
    }

    async getProducts(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    async getProduct(slug: string): Promise<Product> {
        const product = await this.productService.findProduct({
            where: {
                slug,
            },
            relations: {
                subCategories: true,
                category: true,
                images: true
            }
        })

        return product;
    }

    async createProduct(product: Product, categoryId: number): Promise<Product> {
        const category = await this.categoryService.getCategoryById(categoryId);
        product.category = category;
        product.slug = toSlug(product.name)
        product.price = category.price
        const newProduct = await this.productService.saveProduct(product);

        return newProduct
    }

    async updateProduct(product: Product): Promise<Product> {
        product.slug = toSlug(product.name)
        const updatedProduct = await this.productService.updateProduct(product)

        return updatedProduct;
    }

    async deleteProduct(productId: number): Promise<any> {
        return this.productService.deleteProduct(productId)
    }

    async uploadProductImage(image: Express.Multer.File, productId: number, type: string): Promise<Product> {
        const product = await this.productService.findProduct({
            where: {
                id: productId,
            },
            relations: {
                images: true
            }
        });
        const ext = parse(image.originalname).ext;

        if (type === "MAIN") {
            const oldMain = product.images.find((img: ProductImage) => img.type === "MAIN")

            if (oldMain) {
                const fileName = oldMain.imageUrl.split("/files/products/")[1]
                const path = join(__dirname, "../../public/img/products/" + fileName)
                if (existsSync(path)) {
                    rmSync(path)
                }
                product.images = product.images.filter((i: any) => i.id !== oldMain.id)
                await this.imageRepo.delete({
                    id: oldMain.id
                })
            }
        }

        const productImage = await this.imageRepo.create({
            product,
            type,
        })

        productImage.imageUrl = `http://localhost:8080/files/products/${image.filename}`

        const newImage = await this.imageRepo.save(productImage)

        product.images.push(newImage)

        return this.productService.updateProduct(product);
    }

    async updateProductImage(image: Express.Multer.File, imageId: number): Promise<ProductImage> {
        const productImage = await this.imageRepo.findOne({
            where: {
                id: imageId,
            },
        })

        const fileName = productImage.imageUrl.split("/files/products/")[1]
        const path = join(__dirname, "../../public/img/products/" + fileName)
        if (existsSync(path)) {
            rmSync(path)
        }

        productImage.imageUrl = `http://localhost:8080/files/products/${image.filename}`

        return await this.imageRepo.save(productImage)
    }

    async deleteProductImage(imageId: number,) {
        const image = await this.imageRepo.findOne({
            where: {
                id: imageId
            },
            relations: {
                product: true
            }
        })

        const fileName = image.imageUrl.split("/files/products/")[1]
        const path = join(__dirname, "../../public/img/products/" + fileName)
        if (existsSync(path)) {
            rmSync(path)
        }

        const product = await this.productService.getProductById(image.product.id)

        product.images.filter((i: any) => i.id !== image.id)

        this.productService.updateProduct(image.product)

        await this.imageRepo.delete({
            id: imageId
        })

        return
    }

    async searchProducts(search: SearchDTO): Promise<any[]> {
        try {
            const products = await this.productService.findProducts({
                where: {
                     name: search.query && Like("%" + search.query + "%"),
                    subCategories: search.subCategories &&  {
                        id: In(search.subCategories)
                    },
                    category: search.category && {
                        slug: search.category.slug
                    }
                },
                relations: {
                    category: !!search.category,
                    subCategories: !!search.subCategories,
                    images: true
                },
            })

            console.log(products)

            return products;
        } catch (error) {
            console.log(error)
        }
            
    }
}
