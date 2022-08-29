import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {User} from "./auth/user/user.entity";
import { ProductsModule } from './products/products.module';
import {Product} from "./products/product/product.entity";
import {Category} from "./products/category/category.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'roal_cases',
      entities: [User, Product, Category],
      synchronize: true
    }),
      ConfigModule.forRoot(),
      ProductsModule,
      ServeStaticModule.forRoot({
        rootPath: './public/img/categories',
        serveRoot: '/files/categories',
        exclude: ['/api*']
      }),
      ServeStaticModule.forRoot({
        rootPath: './public/img/products',
        serveRoot: '/files/products',
        exclude: ['/api*']
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
