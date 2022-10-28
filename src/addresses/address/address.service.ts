import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./address.entity";

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private addressRepo: Repository<Address>
    ) { }

    async saveAddress(address: any): Promise<Address> {
        return this.addressRepo.save(address)
    }

    async getAddresses(userId: number): Promise<Address[]> {
        return this.addressRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                user: true
            }
        })
    }

    async getAddress(id: number): Promise<Address> {
        return this.addressRepo.findOne({
            where: {
                id,
            }
        })
    }  

    async deleteAddress(id: number): Promise<any> {
        return this.addressRepo.delete(id)
    }
}