import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SubcategoriesModule} from 'src/subcategories/subcategories.module';
import {SubCategory} from 'src/subcategories/subcategory/subcategory.entity';
import {Group} from './group/group.entity';
import {GroupService} from './group/group.service';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, SubCategory])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupService],
  exports: [GroupService, GroupService],
})
export class GroupsModule {}
