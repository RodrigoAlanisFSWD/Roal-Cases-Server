import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {MulterModule} from "@nestjs/platform-express";
import {ProductService} from "./product/product.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./product/product.entity";
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductImage } from './image/image.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Product, ProductImage]),
    MulterModule.register({
      dest: "./public/img"
    }),
    CategoriesModule
  ],
  providers: [ProductsService, ProductService],
  controllers: [ProductsController],
  exports: [ProductService],
})
export class ProductsModule {}
