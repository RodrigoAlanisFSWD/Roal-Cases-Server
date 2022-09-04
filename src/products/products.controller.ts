import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {AdminGuard} from "../common/guards/admin.guard";
import {AtGuard} from "../common/guards";
import { ProductsService } from './products.service';
import { Product } from './product/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/products')
export class ProductsController {

    constructor(
        private productsService: ProductsService
    ) {}

    @Get("/")
    @HttpCode(HttpStatus.OK)
    getProducts(): Promise<Product[]> {
        return this.productsService.getProducts();
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    getProduct(@Param('id') productId: number): Promise<Product> {
        return this.productsService.getProduct(productId);
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/:category")
    @HttpCode(HttpStatus.CREATED)
    createProduct(@Body() product: Product, @Param("category") categoryId: number): Promise<Product> {
        return this.productsService.createProduct(product, categoryId)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/upload-image/:id")
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: (req, file, callback) => {
                callback(null, "./public/img/products/")
            },
            filename: (req, file, cb) => {
                const filename = parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const ext = parse(file.originalname).ext;

                cb(null, `${filename}${ext}`)
            }
        })
    }))
    @HttpCode(HttpStatus.OK)
    uploadProductImage(@UploadedFile() image: Express.Multer.File, @Param("id") productId: number): Promise<Product> {
        return this.productsService.uploadProductImage(image, productId);
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Put("/")
    updateProduct(@Body() product: Product): Promise<Product> {
        return this.productsService.updateProduct(product)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    deleteProduct(@Param('id') productId: number): Promise<any> {
        return this.productsService.deleteProduct(productId)
    }
}
