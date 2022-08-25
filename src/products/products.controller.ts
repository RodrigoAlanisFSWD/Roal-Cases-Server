import {Controller, Delete, Get, Post, Put, UseGuards} from '@nestjs/common';
import {AdminGuard} from "../common/guards/admin.guard";
import {AtGuard} from "../common/guards";

@Controller('products')
export class ProductsController {

    @Get("/")
    getProducts() {

    }

    @Get("/:id")
    getProduct() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/")
    createProduct() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Put("/:id")
    updateProduct() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Delete("/:id")
    deleteProduct() {

    }
}
