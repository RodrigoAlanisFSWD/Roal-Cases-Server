import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard, AtGuard } from 'src/common/guards';
import { ModelsService } from './models.service';
import { Brand, Model } from './Model.entity';

@Controller('/api/models')
export class ModelsController {

    constructor(
        private modelsService: ModelsService
    ) { }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post("/")
    async createModel(@Body() model: Model): Promise<Model> {
        return this.modelsService.createModel(model)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @Put("/")
    async updateModel(@Body() model: Model): Promise<Model> {
        return this.modelsService.updateModel(model)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    async deleteModel(@Param("id") id: number): Promise<any> {
        return this.modelsService.deleteModel(id)
    }

    @HttpCode(HttpStatus.OK)
    @Get("/get/:brand")
    async getModels(@Param("brand") brand: number): Promise<Model[]> {
        return this.modelsService.getModels(brand)
    }

    @HttpCode(HttpStatus.OK)
    @Get("/getOne/:id")
    async getModel(@Param("id") id: number): Promise<Model> {
        return this.modelsService.getModel(id)
    }

    @HttpCode(HttpStatus.OK)
    @Post("/search")
    async searchModels(@Body() categories: string[]): Promise<Model[]> {
        return this.modelsService.searchModels(categories)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post("/brands")
    async createBrand(@Body() brand: Brand): Promise<Brand> {
        return this.modelsService.createBrand(brand)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/brands/:id")
    async deleteBrand(@Param("id") id: number): Promise<any> {
        return this.modelsService.deleteBrand(id)
    }

    @UseGuards(AtGuard, AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Put("/brands/")
    async updateBrand(@Body() brand: Brand): Promise<Brand> {
        return this.modelsService.updateBrand(brand)
    }

    @HttpCode(HttpStatus.OK)
    @Get("/brands/")
    async getBrands(): Promise<Brand[]> {
        return this.modelsService.getBrands()
    }

    @HttpCode(HttpStatus.OK)
    @Get("/brands/:id")
    async getBrand(@Param("id") id: number): Promise<Brand> {
        return this.modelsService.getBrand(id)
    }

    @HttpCode(HttpStatus.OK)
    @Post("/brands/search")
    async searchBrands(@Body() categories: string[]): Promise<Brand[]> {
        return this.modelsService.searchBrands(categories)
    }

}
