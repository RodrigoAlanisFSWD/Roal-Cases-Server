import { Injectable } from '@nestjs/common';
import { Address } from './address/address.entity';
import { AddressService } from './address/address.service';

@Injectable()
export class AddressesService {

    constructor(
        private addressService: AddressService
    ) { }

    async createAddress(address: Address, userId: number): Promise<Address> {
        return this.addressService.saveAddress({
            ...address,
            user: {
                id: userId
            }
        })
    }

    async getAddresses(userId: number): Promise<Address[]> {
        return this.addressService.getAddresses(userId)
    }

    async getAddress(id: number): Promise<Address> {
        return this.addressService.getAddress(id)
    }

    async updateAddress(address: Address): Promise<Address> {
        return this.addressService.saveAddress(address)
    }

    async deleteAddress(id: number): Promise<any> {
        return this.addressService.deleteAddress(id)
    }

}   
