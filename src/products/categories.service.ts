import { Injectable } from '@nestjs/common';
import {Category} from "./category/category.entity";
import {CategoryService} from "./category/category.service";
import {Product} from "./product/product.entity";

@Injectable()
export class CategoriesService {

    constructor(
        private categoryService: CategoryService
    ) {
    }

    async getCategories(): Promise<Category[]> {
        return this.categoryService.getCategories();
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

    async deleteCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryService.getCategoryById(categoryId);
        await this.categoryService.deleteCategory(category)
        return category;
    }

    async uploadCategoryImage(image: Express.Multer.File, categoryId: number): Promise<Category> {
        const category = await this.categoryService.getCategoryById(categoryId);

        category.imageUrl = `http://localhost:8080/files/categories/${image.filename}`

        return this.categoryService.updateCategory(category);
    }
}
