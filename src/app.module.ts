import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';
import {User} from "./auth/user/user.entity";
import { ProductsModule } from './products/products.module';
import {Product} from "./products/product/product.entity";
import {Category} from "./products/category/category.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_DB'),
          entities: [User, Product, Category],
          synchronize: true
        }),
        inject: [ConfigService]
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
      }),
      MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
