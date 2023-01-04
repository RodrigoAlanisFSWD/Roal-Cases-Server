import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SubCategory} from 'src/subcategories/subcategory/subcategory.entity';
import {FindOneOptions, Repository} from 'typeorm';
import {Group} from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
    @InjectRepository(SubCategory)
    private subCategoryRepo: Repository<SubCategory>,
  ) {}

  async saveGroup(group: Group) {
    const newGroup = this.groupRepo.create(group);

    return this.groupRepo.save(newGroup);
  }

  async getGroupById(id: number) {
    return this.groupRepo.findOneBy({
      id,
    });
  }

  async findGroup(options: FindOneOptions<Group>) {
    return this.groupRepo.findOne(options);
  }

  async getGroups() {
    return this.groupRepo.find({
      relations: {
        subCategories: true,
      },
    });
  }

  async deleteGroup(groupId: number) {
    const group = await this.groupRepo.findOne({
      where: {
        id: groupId,
      },
      relations: {
        subCategories: true,
      },
    });

    group.subCategories.forEach(async (subCategory: SubCategory) => {
      await this.subCategoryRepo.delete({
        id: subCategory.id,
      });
    });

    return this.groupRepo.delete({
      id: groupId,
    });
  }

  async updateGroup(group: Group) {
    return this.groupRepo.save(group);
  }
}
