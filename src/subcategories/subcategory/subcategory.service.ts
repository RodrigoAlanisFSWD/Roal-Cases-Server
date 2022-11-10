import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { SubCategory } from "./subcategory.entity";

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(SubCategory)
        private subCategoryRepo: Repository<SubCategory>
    ) {}

    async saveSubCategory(subCategory: SubCategory) {
        const newSubCategory = this.subCategoryRepo.create(subCategory);

        return this.subCategoryRepo.save(newSubCategory);
    }

    async getSubCategoryById(id: number) {
        return this.subCategoryRepo.findOneBy({
            id,
        })
    }

    async findSubCategory(options: FindOneOptions<SubCategory>) {
        return this.subCategoryRepo.findOne(options);
    }

    async findSubCategories(options: FindOneOptions<SubCategory>) {
        return this.subCategoryRepo.find(options);
    }

    async getSubCategories() {
        return this.subCategoryRepo.find();
    }

    async deleteSubCategory(subCategoryId: number) {
        return this.subCategoryRepo.delete({
            id: subCategoryId,
        })
    }

    async updateSubCategory(subCategory: SubCategory) {
        return this.subCategoryRepo.save(subCategory)
    }
}