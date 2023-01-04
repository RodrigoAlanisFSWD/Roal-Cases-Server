import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ModelsController} from './models.controller';
import {Brand, Model} from './model.entity';
import {ModelsService} from './models.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model, Brand])],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
