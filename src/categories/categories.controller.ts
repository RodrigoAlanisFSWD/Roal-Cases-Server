import {
    Body,
    Controller,
    Delete, FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    Param, ParseFilePipe,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AtGuard} from "../common/guards";
import {AdminGuard} from "../common/guards/admin.guard";
import {CategoriesService} from "./categories.service";
import {Category} from "./category/category.entity";
import {Product} from "../products/product/product.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/categories')
export class CategoriesController {

    constructor(
        private categoriesService: CategoriesService
    ) {
    }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    getCategories(): Promise<Category[]> {
        return this.categoriesService.getCategories();
    }

    @Get("/:slug")
    @HttpCode(HttpStatus.OK)
    getCategory(@Param('slug') slug: string): Promise<Category> {
        return this.categoriesService.getCategory(slug);
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    createCategory(@Body() category: Category): Promise<Category> {
        return this.categoriesService.createCategory(category)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/upload-image/:id")
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: (req, file, callback) => {
                callback(null, "./public/img/categories/")
            },
            filename: (req, file, cb) => {
                const filename = req.params.id;
                const ext = parse(file.originalname).ext;

                cb(null, `${filename}${ext}`)
            }
        })
    }))
    @HttpCode(HttpStatus.OK)
    uploadCategoryImage(@UploadedFile() image: Express.Multer.File, @Param("id") categoryId: number): Promise<Category> {
        return this.categoriesService.uploadCategoryImage(image, categoryId);
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Put("/")
    updateCategory(@Body() category: Category): Promise<Category> {
        return this.categoriesService.updateCategory(category)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    deleteCategory(@Param('id') categoryId: number): Promise<any> {
        return this.categoriesService.deleteCategory(categoryId)
    }

}
