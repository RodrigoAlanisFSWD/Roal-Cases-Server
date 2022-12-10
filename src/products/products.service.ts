import { Injectable } from '@nestjs/common';
import { ProductService } from "./product/product.service";
import { Product } from "./product/product.entity";
import { CategoryService } from '../categories/category/category.service';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { ProductImage } from './image/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { toSlug } from 'src/common/utils/functions';
import { SearchDTO } from './search';
import Stripe from 'stripe';

@Injectable()
export class ProductsService {

    private stripe: Stripe;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        @InjectRepository(ProductImage)
        private imageRepo: Repository<ProductImage>,
    ) {
        this.stripe = new Stripe("sk_test_51LyNkyKPetfkQCPTULboJTU5KLygsDBuZIBUiaS2L1b4qnS8SOwkjiyT3vgjnPMQf8sN7Rpkwp6MOjel5Hph6esi00QxaW0vv7", {
            apiVersion: "2022-08-01"
        })
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

        const stripeProduct = await this.stripe.products.create({
            name: product.name,
            default_price_data: {
                unit_amount: product.price * 100,
                currency: "MXN",
            },
            expand: ['default_price'],
        })

        product.stripeId = stripeProduct.id;

        const newProduct = await this.productService.saveProduct(product);

        return newProduct
    }

    async updateProduct(product: Product): Promise<Product> {
        const oldProduct = await this.productService.getProductById(product.id)

        product.slug = toSlug(product.name)
        const updatedProduct = await this.productService.updateProduct(product)
        
        const stripeProduct = await this.stripe.products.retrieve(updatedProduct.stripeId)

        if (oldProduct.price !== product.price) {
            await this.stripe.prices.update(stripeProduct.default_price.toString(), {
                active: false
            })

            const price = await this.stripe.prices.create({
                active: true,
                unit_amount: product.price * 100,
                currency: "MXN",
            })

            await this.stripe.products.update(updatedProduct.stripeId, { name: updatedProduct.name, default_price: price.id })
        } else {
            await this.stripe.products.update(updatedProduct.stripeId, { name: updatedProduct.name })
        }

        return updatedProduct;
    }

    async deleteProduct(productId: number): Promise<any> {
        const product = await this.productService.getProductById(productId)

        await this.productService.deleteProduct(productId)
    
        await this.stripe.products.del(product.stripeId)

        return product 
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

        await this.stripe.products.update(product.stripeId, { images: [product.images.find((image: ProductImage) => image.type === "MAIN").imageUrl] })

        return this.productService.updateProduct(product);
    }

    async updateProductImage(image: Express.Multer.File, imageId: number): Promise<ProductImage> {
        const productImage = await this.imageRepo.findOne({
            where: {
                id: imageId,
            },
            relations: {
                product: true
            }
        })

        const fileName = productImage.imageUrl.split("/files/products/")[1]
        const path = join(__dirname, "../../public/img/products/" + fileName)
        if (existsSync(path)) {
            rmSync(path)
        }

        productImage.imageUrl = `http://localhost:8080/files/products/${image.filename}`

        const product = productImage.product;

        await this.stripe.products.update(product.stripeId, { images: [product.images.find((image: ProductImage) => image.type === "MAIN").imageUrl] })

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
