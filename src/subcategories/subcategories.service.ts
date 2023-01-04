import {Injectable} from '@nestjs/common';
import {In} from 'typeorm';
import {Group} from '../groups/group/group.entity';
import {GroupService} from '../groups/group/group.service';
import {CreateSubCategoriesDTO} from './subcategories.controller';
import {SubCategory} from './subcategory/subcategory.entity';
import {SubCategoryService} from './subcategory/subcategory.service';

@Injectable()
export class SubcategoriesService {
  constructor(
    private subCategoryService: SubCategoryService,
    private groupService: GroupService,
  ) {}

  async deleteSubCategory(subCategoryId: number): Promise<any> {
    console.log(subCategoryId)
    return this.subCategoryService.deleteSubCategory(subCategoryId);
  }

  async updateSubCategory(subCategory: SubCategory): Promise<SubCategory> {
    return this.subCategoryService.updateSubCategory(subCategory);
  }

  async createSubCategories(
    data: CreateSubCategoriesDTO,
    groupId: number,
  ): Promise<SubCategory[]> {
    const group = await this.groupService.getGroupById(groupId);

    let res: SubCategory[] = [];

    data.subCategories.forEach(async (subCategory: SubCategory) => {
      res.push(subCategory);

      subCategory.group = group;

      await this.subCategoryService.saveSubCategory(subCategory);
    });

    console.log(res);

    return res;
  }

  async getSubCategories(): Promise<SubCategory[]> {
    return this.subCategoryService.getSubCategories();
  }

  async getSubCategoriesFromIds(ids: number[]): Promise<SubCategory[]> {
    return this.subCategoryService.findSubCategories({
      where: {
        id: In(ids),
      },
    });
  }
}
