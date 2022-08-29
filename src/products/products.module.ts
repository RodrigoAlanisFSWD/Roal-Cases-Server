import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {CategoriesController} from "./categories.controller";
import {MulterModule} from "@nestjs/platform-express";
import {CategoriesService} from "./categories.service";
import {ProductService} from "./product/product.service";
import {CategoryService} from "./category/category.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./product/product.entity";
import {Category} from "./category/category.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
      TypeOrmModule.forFeature([Product, Category]),
    MulterModule.register({
      dest: "./public/img"
    }),
  ],
  providers: [ProductsService, CategoriesService, ProductService, CategoryService],
  controllers: [ProductsController, CategoriesController],
})
export class ProductsModule {}
