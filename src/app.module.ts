import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from "./auth/user/user.entity";
import { ProductsModule } from './products/products.module';
import { Product } from "./products/product/product.entity";
import { Category } from "./categories/category/category.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from './mail/mail.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { SubCategory } from './subcategories/subcategory/subcategory.entity';
import { Group } from './groups/group/group.entity';
import { GroupsModule } from './groups/groups.module';
import { ProductImage } from './products/image/image.entity';
import { CartModule } from './cart/cart.module';
import { Cart, CartProduct } from './cart/cart.entity';
import { ModelsModule } from './models/models.module';
import { Brand, Model } from './models/model.entity';
import { Address } from './shipping/entities/address/address.entity';
import { OrdersModule } from './orders/orders.module';
import { Order, OrderProduct } from './orders/order/order.entity';
import { ShippingModule } from './shipping/shipping.module';
import { Shipment } from './shipping/entities/shipment/shipment.entity';
import { ShoppingModule } from './shopping/shopping.module';

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
        entities: [User, Product, Category, SubCategory, Group, ProductImage, Cart, CartProduct, Model, Brand, Address, Order, OrderProduct, Shipment],
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
    MailModule,
    CategoriesModule,
    SubcategoriesModule,
    ProductsModule,
    GroupsModule,
    CartModule,
    ModelsModule,
    OrdersModule,
    ShippingModule,
    ShoppingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
