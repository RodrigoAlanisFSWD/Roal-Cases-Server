import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Group} from '../groups/group/group.entity';
import {SubcategoriesController} from './subcategories.controller';
import {SubcategoriesService} from './subcategories.service';
import {SubCategoryService} from './subcategory/subcategory.service';
import {GroupsModule} from 'src/groups/groups.module';
import {SubCategory} from './subcategory/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), GroupsModule],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, SubCategoryService],
  exports: [SubcategoriesService, SubCategoryService],
})
export class SubcategoriesModule {}
