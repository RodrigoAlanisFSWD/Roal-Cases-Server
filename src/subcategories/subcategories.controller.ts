import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IsArray, IsNotEmpty } from 'class-validator';
import { AtGuard } from 'src/common/guards';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Group } from '../groups/group/group.entity';
import { SubcategoriesService } from './subcategories.service';
import { SubCategory } from './subcategory/subcategory.entity';

export class CreateSubCategoriesDTO {
    @IsNotEmpty()
    @IsArray()
    subCategories: SubCategory[];
}

@Controller('/api/subcategories')
export class SubcategoriesController {

    constructor(
        private subCategoriesService: SubcategoriesService
    ) {}

    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getSubCategories(): Promise<SubCategory[]> {
        return this.subCategoriesService.getSubCategories()
    }

    @Post("/fromIds")
    @HttpCode(HttpStatus.OK)
    async getSubCategoriesFromIds(@Body() ids: Array<number>): Promise<SubCategory[]> {
        return this.subCategoriesService.getSubCategoriesFromIds(ids)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/:groupId")
    @HttpCode(HttpStatus.CREATED)
    async createSubCategories(@Body() data: CreateSubCategoriesDTO, @Param("groupId") groupId: number): Promise<SubCategory[]> {
        return this.subCategoriesService.createSubCategories(data, groupId)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Put("/")
    @HttpCode(HttpStatus.OK)
    async updateSubCategory(@Body() subCategory: SubCategory): Promise<SubCategory> {
        return this.subCategoriesService.updateSubCategory(subCategory)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Delete("/:subCategoryId")
    @HttpCode(HttpStatus.OK)
    async deleteSubCategory(@Param("subCategoryId") subCategoryId: number): Promise<any> {
        return this.subCategoriesService.deleteSubCategory(subCategoryId)
    }

}
