import {HttpException, Injectable} from '@nestjs/common';
import { Cart, CartProduct } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import {Discount, DiscountType} from '../entities/discount/discount.entity';
import {DiscountService} from '../entities/discount/discount.service';

@Injectable()
export class DiscountsService {
  constructor(private discountService: DiscountService, private cartService: CartService) {}

  async createDiscount(discount: Discount): Promise<Discount> {
    return this.discountService.saveDiscount(discount);
  }

  async getDiscounts(): Promise<Discount[]> {
    return this.discountService.getDiscounts();
  }

  async getDiscount(id: number): Promise<Discount> {
    return this.discountService.getDiscount(id);
  }

  async deleteDiscount(id: number): Promise<any> {
    return this.discountService.deleteDiscount(id);
  }

  async updateDiscount(discount: Discount): Promise<Discount> {
    return this.discountService.saveDiscount(discount);
  }

  async validateDiscount(discount: Discount, userId: number): Promise<Cart> {
    const cart = await this.cartService.getCart(userId)

    if (discount.type === DiscountType.FOR_FINAL_PRICE) {
      return {
        ...cart,
        totalCost: cart.totalCost - ((cart.totalCost / 100) * discount.percent)
      }
    } else if (discount.type === DiscountType.FOR_PRODUCTS) {
      let isValid = true;

      let index = 0;

      const newProducts = cart.products;

      while(isValid) {
        const search = cart.products.findIndex((product: CartProduct) => product.product.id === discount.products[index].id);

        if (search < 0) {
          isValid = false;
        } else {
          isValid = true;

          const product = newProducts[search]
          const price = product.product.price;
          
          newProducts[search] = {
            ...product,
            product: {
              ...product.product,
              price: price - ((price / 100) * discount.percent)
            }
          }
        }
      }

      return {
        ...cart,
        products: newProducts,
      }
    }
  }

  async getDiscountFromCode(code: string): Promise<Discount> {
    const discount = await this.discountService.findDiscount({
      where: {
        code,
      }
    })

    if (new Date(discount.expirationDate).valueOf() > new Date().valueOf()) {
      return discount
    }

    throw new HttpException('Invalid Discount', 404);
  }
}
