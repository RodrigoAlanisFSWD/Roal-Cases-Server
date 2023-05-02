import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Brand, Model} from './model.entity';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private modelRepo: Repository<Model>,
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
  ) {}

  async createModel(model: Model): Promise<Model> {
    return this.modelRepo.save(model);
  }

  async updateModel(model: Model): Promise<Model> {
    return this.modelRepo.save(model);
  }

  async deleteModel(id: number): Promise<any> {
    return this.modelRepo.delete(id);
  }

  async getModels(brand: number): Promise<Model[]> {
    const models = await this.modelRepo.find({
      where: {
        brand: {
          id: brand,
        },
      },
      relations: {
        brand: true,
      },
    });

    return models;
  }

  async getModel(id: number): Promise<Model> {
    const model = await this.modelRepo.findOne({
      where: {
        id,
      },
      relations: {
        categories: true,
        brand: true,
      },
    });

    return model;
  }

  async createBrand(brand: Brand): Promise<Brand> {
    return this.brandRepo.save(brand);
  }

  async deleteBrand(id: number): Promise<any> {
    return this.brandRepo.delete(id);
  }

  async updateBrand(brand: Brand): Promise<Brand> {
    return this.brandRepo.save(brand);
  }

  async getBrands(): Promise<Brand[]> {
    return this.brandRepo.find({
      relations: {
        categories: true,
      },
    });
  }

  async getBrand(id: any): Promise<Brand> {
    return this.brandRepo.findOne({
      where: {
        id,
      },
      relations: {
        categories: true,
      },
    });
  }

  async searchBrands(categories: string[]): Promise<Brand[]> {
    return this.brandRepo.find({
      where: {
        categories: {
          id: In(categories),
        },
      },
      relations: {
        categories: true,
      },
    });
  }

  async searchModels(categories: string[]): Promise<Model[]> {
    return this.modelRepo.find({
      where: {
        categories: {
          id: In(categories),
        },
      },
      relations: {
        categories: true,
      },
    });
  }
}
