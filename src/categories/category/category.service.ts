import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {FindOneOptions, Repository} from "typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>
    ) {
    }

    async saveCategory(category: Category) {
        const newCategory = this.categoryRepo.create(category);

        return this.categoryRepo.save(newCategory);
    }

    async getCategoryById(id: number) {
        return this.categoryRepo.findOneBy({
            id,
        })
    }

    async findCategory(options: FindOneOptions<Category>) {
        return this.categoryRepo.findOne(options);
    }

    async getCategories() {
        return this.categoryRepo.find();
    }

    async deleteCategory(categoryId: number) {
        return this.categoryRepo.delete({
            id: categoryId
        })
    }

    async updateCategory(category: Category) {
        return this.categoryRepo.save(category)
    }
}