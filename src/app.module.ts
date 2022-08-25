import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {User} from "./auth/user/user.entity";
import { ProductsModule } from './products/products.module';
import { CategoriesController } from './products/categories.controller';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'roal_cases',
      entities: [User],
      synchronize: true
    }),
      ConfigModule.forRoot(),
      ProductsModule
  ],
  controllers: [AppController, CategoriesController],
  providers: [AppService],
})
export class AppModule {}
