import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group/group.entity';
import { SubcategoriesController } from './subcategories.controller';
import { SubCategory } from './subcategory/subcategory.entity';
import { SubcategoriesService } from './subcategories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory, Group])
  ],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService]
})
export class SubcategoriesModule {}
