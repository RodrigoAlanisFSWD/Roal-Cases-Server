import { Injectable } from '@nestjs/common';
import { Discount } from '../entities/discount/discount.entity';
import { DiscountService } from '../entities/discount/discount.service';

@Injectable()
export class DiscountsService {

    constructor(
        private discountService: DiscountService
    ) { }

    async createDiscount(discount: Discount): Promise<Discount> {
        return this.discountService.saveDiscount(discount)
    }

    async getDiscounts(): Promise<Discount[]> {
        return this.discountService.getDiscounts()
    }

    async getDiscount(id: number): Promise<Discount> {
        return this.discountService.getDiscount(id)
    }

    async deleteDiscount(id: number): Promise<any> {
        return this.discountService.deleteDiscount(id)
    }

    async updateDiscount(discount: Discount): Promise<Discount> {
        return this.discountService.saveDiscount(discount)
    }

}
