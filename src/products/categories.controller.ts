import {Controller, Delete, Get, Post, Put, UseGuards} from '@nestjs/common';
import {AtGuard} from "../common/guards";
import {AdminGuard} from "../common/guards/admin.guard";

@Controller('categories')
export class CategoriesController {

    @Get("/")
    getCategories() {

    }

    @Get("/:id")
    getProductsFromCategory() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/")
    createCategory() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Put("/:id")
    updateCategory() {

    }

    @UseGuards(AtGuard, AdminGuard)
    @Delete("/:id")
    deleteCategory() {

    }

}
