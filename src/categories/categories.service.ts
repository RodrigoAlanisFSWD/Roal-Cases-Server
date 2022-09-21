import { Injectable } from '@nestjs/common';
import {Category} from "./category/category.entity";
import {CategoryService} from "./category/category.service";
import {Product} from "../products/product/product.entity";
import { join, parse } from 'path';
import fs, { existsSync, rmSync } from 'fs'

@Injectable()
export class CategoriesService {

    constructor(
        private categoryService: CategoryService
    ) {
    }

    async getCategories(): Promise<Category[]> {
        return this.categoryService.getCategories();
    }

    getCategory(categoryId: number): Promise<Category> {
        return this.categoryService.getCategoryById(categoryId);
    }

    async getProductsFromCategory(categoryId: number): Promise<Product[]> {
        const category = await this.categoryService.findCategory({
            where: {
                id: categoryId
            },
            relations: {
                products: true
            }
        })

        return category.products
    }

    async createCategory(category: Category): Promise<Category> {
        const newCategory = await this.categoryService.saveCategory(category);

        return newCategory
    }

    async updateCategory(category: Category): Promise<Category> {
        const updatedCategory = await this.categoryService.updateCategory(category)

        return updatedCategory;
    }

    async deleteCategory(categoryId: number): Promise<any> {
        return this.categoryService.deleteCategory(categoryId)
    }

    async uploadCategoryImage(image: Express.Multer.File, categoryId: number): Promise<Category> {
        const category = await this.categoryService.getCategoryById(categoryId);
        const ext = parse(image.originalname).ext;

        if (category.imageUrl !== null) {
            const fileName = category.id + ext
            const path = join(__dirname, "../../public/categories/" + fileName)
            if (existsSync(path)) {
                rmSync(path)
            }
        }

        category.imageUrl = `http://localhost:8080/files/categories/${category.id}${ext}`

        return this.categoryService.updateCategory(category);
    }
}
