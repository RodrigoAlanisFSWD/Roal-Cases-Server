import { Injectable } from '@nestjs/common';
import { Group } from './group/group.entity';
import { GroupService } from './group/group.service';
import { CreateSubCategoriesDTO } from './subcategories.controller';
import { SubCategory } from './subcategory/subcategory.entity';
import { SubCategoryService } from './subcategory/subcategory.service';

@Injectable()
export class SubcategoriesService {
    
    constructor(
        private subCategoryService: SubCategoryService,
        private groupService: GroupService
    ) {}

    async deleteGroup(groupId: number): Promise<any> {
        return this.groupService.deleteGroup(groupId)
    }

    async updateGroup(group: Group): Promise<Group> {
        return this.groupService.updateGroup(group)
    }
    
    async createGroup(group: Group): Promise<Group> {
        return this.groupService.saveGroup(group);
    }

    async getGroupSubCategories(groupId: number): Promise<SubCategory[]> {
        const { subCategories } = await this.groupService.findGroup({
            where: {
                id: groupId
            },
            relations: {
                subCategories: true
            }
        })

        return subCategories
    }

    async getGroups(): Promise<Group[]> {
        return this.groupService.getGroups()
    }

    async deleteSubCategory(subCategoryId: number): Promise<any> {
        return this.subCategoryService.deleteSubCategory(subCategoryId)
    }

    async updateSubCategory(subCategory: SubCategory): Promise<SubCategory> {
        return this.subCategoryService.updateSubCategory(subCategory)
    }

    async createSubCategories(data: CreateSubCategoriesDTO, groupId: number): Promise<SubCategory[]> {
        const group = await this.groupService.getGroupById(groupId)

        let res: SubCategory[] = []

        data.subCategories.forEach(async (subCategory: SubCategory) => {
            subCategory.group = group;

            await this.subCategoryService.saveSubCategory(subCategory)

            res.push(subCategory)
        })

        return res
    }

    async getSubCategories(): Promise<SubCategory[]> {
        return this.subCategoryService.getSubCategories()
    }

}
