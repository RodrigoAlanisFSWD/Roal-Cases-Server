import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {AdminGuard, AtGuard} from 'src/common/guards';
import {Discount} from '../entities/discount/discount.entity';
import {DiscountsService} from './discounts.service';

@Controller('/api/discounts')
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createDiscount(@Body() discount: Discount): Promise<Discount> {
    return this.discountsService.createDiscount(discount);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getDiscounts(): Promise<Discount[]> {
    return this.discountsService.getDiscounts();
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getDiscount(@Param('id') id: number): Promise<Discount> {
    return this.discountsService.getDiscount(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteDiscount(@Param('id') id: number): Promise<any> {
    return this.discountsService.deleteDiscount(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/')
  async updateDiscount(@Body() discount: Discount): Promise<Discount> {
    return this.discountsService.updateDiscount(discount);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get("/code/:code")
  async getDiscountFromCode(@Param("code") code: string): Promise<Discount> {
    return this.discountsService.getDiscountFromCode(code)
  }
}
