import {Injectable} from '@nestjs/common';
import {Category} from './category/category.entity';
import {CategoryService} from './category/category.service';
import {Product} from '../products/product/product.entity';
import {join, parse} from 'path';
import fs, {existsSync, rm} from 'fs';
import {toSlug} from 'src/common/utils/functions';

@Injectable()
export class CategoriesService {
  constructor(private categoryService: CategoryService) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  getCategory(slug: string): Promise<Category> {
    return this.categoryService.findCategory({
      where: {
        slug,
      },
      relations: {
        products: true,
      },
    });
  }

  async getProductsFromCategory(categoryId: number): Promise<Product[]> {
    const category = await this.categoryService.findCategory({
      where: {
        id: categoryId,
      },
      relations: {
        products: true,
      },
    });

    return category.products;
  }

  async createCategory(category: Category): Promise<Category> {
    category.slug = toSlug(category.name);
    const newCategory = await this.categoryService.saveCategory(category);

    return newCategory;
  }

  async updateCategory(category: Category): Promise<Category> {
    category.slug = toSlug(category.name);
    const updatedCategory = await this.categoryService.updateCategory(category);

    return updatedCategory;
  }

  async deleteCategory(categoryId: number): Promise<any> {
    return this.categoryService.deleteCategory(categoryId);
  }

  async uploadCategoryImage(
    image: Express.Multer.File,
    categoryId: number,
  ): Promise<Category> {
    const category = await this.categoryService.getCategoryById(categoryId);
    const ext = parse(image.originalname).ext;

    console.log(category);

    if (category.imageUrl !== null) {
      const fileName = category.imageUrl.split('/files/categories/')[1];
      const path = join(__dirname, '../../public/img/categories/' + fileName);

      if (existsSync(path)) {
        rm(path, () => {
          console.log('removed');
        });
      }
    }

    category.imageUrl = `/files/categories/${category.id}${ext}`;

    return this.categoryService.saveCategory(category);
  }
}
