import {Module} from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoriesController} from './categories.controller';
import {CategoriesService} from './categories.service';
import {Category} from './category/category.entity';
import {CategoryService} from './category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    MulterModule.register({
      dest: './public/img',
    }),
  ],
  providers: [CategoriesService, CategoryService],
  controllers: [CategoriesController],
  exports: [CategoryService],
})
export class CategoriesModule {}
