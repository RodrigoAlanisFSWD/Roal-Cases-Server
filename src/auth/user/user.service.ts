import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {
    }

    async saveUser(user: User) {
        const newUser = await this.userRepo.create(user)

        newUser.role = 'USER';

        return this.userRepo.save(newUser)
    }

    async findUserById(id: number) {
        return this.userRepo.findOneBy({
            id,
        })
    }

    async findUserByEmail(email: string) {
        return this.userRepo.findOneBy({
            email,
        })
    }

    async updateUser(user: User) {
        return this.userRepo.save(user);
    }

    async getUserWithCart(userId: number): Promise<User> {
        return this.userRepo.findOne({
            where: {
                id: userId,
            },
            relations: {
                cart: {
                    products: {
                        product: true
                    }
                }
            }
        })
    }
}