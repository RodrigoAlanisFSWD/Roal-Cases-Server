import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {SubCategory} from 'src/subcategories/subcategory/subcategory.entity';
import {SubCategoryService} from 'src/subcategories/subcategory/subcategory.service';
import {Group} from './group/group.entity';
import {GroupService} from './group/group.service';

@Injectable()
export class GroupsService {
  constructor(private groupService: GroupService) {}

  async deleteGroup(groupId: number): Promise<any> {
    try {
      await this.groupService.deleteGroup(groupId);
    } catch (error) {
     throw new HttpException('Not Delete Accepted', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateGroup(group: Group): Promise<Group> {
    return this.groupService.updateGroup(group);
  }

  async createGroup(group: Group): Promise<Group> {
    return this.groupService.saveGroup(group);
  }

  async getGroupSubCategories(groupId: number): Promise<SubCategory[]> {
    const {subCategories} = await this.groupService.findGroup({
      where: {
        id: groupId,
      },
      relations: {
        subCategories: true,
      },
    });

    return subCategories;
  }

  async getGroups(): Promise<Group[]> {
    return this.groupService.getGroups();
  }

  getGroup(groupId: number): Promise<Group> {
    return this.groupService.getGroupById(groupId);
  }
}
