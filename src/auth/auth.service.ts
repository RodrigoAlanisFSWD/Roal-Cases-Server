import {ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from "./user/user.entity";
import {UserService} from "./user/user.service";
import * as bcrypt from 'bcrypt';
import {Tokens} from "../common/types/auth";
import {JwtService} from "@nestjs/jwt";
import {find} from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    async signUp(user: User): Promise<Tokens> {
        try {
        user.password = await this.hashData(user.password);
        const newUser = await this.userService.saveUser(user)

        const tokens = await this.getTokens(newUser.id, newUser.email);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
        } catch (e) {
            throw new ForbiddenException("Register Error")
        }
        
    }

    async signIn(user: User): Promise<Tokens> {
        const findedUser = await this.userService.findUserByEmail(user.email);

        console.log(findedUser, 'user')

        if (!findedUser) throw new ForbiddenException("Access Denied")

        const verify = await bcrypt.compare(user.password, findedUser.password)

        if (!verify) throw  new UnauthorizedException("Incorrect Password")

        const tokens = await this.getTokens(findedUser.id, findedUser.email);

        await this.updateRtHash(findedUser.id, tokens.refresh_token);

        return tokens;
    }

    async refreshToken(userId: number, rt: string) {
        console.log(rt, userId)
        const user = await this.userService.findUserById(userId);

        if (!user) throw new ForbiddenException("Access Denied")

        const verify = await bcrypt.compare(rt, user.hashedRt);

        if (!verify) throw  new UnauthorizedException("Incorrect Password")

        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: number) {
        const user = await this.userService.findUserById(userId);

        user.hashedRt = null;

        await this.userService.updateUser(user);
    }

    async getProfile(userId: number): Promise<User> {
        const user = await this.userService.findUserById(userId)

        return user;
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                expiresIn: 60 * 15,
                secret: 'secret_key_access'
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                expiresIn: 60 * 60 * 24,
                secret: 'secret_key'
            })
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        }
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);

        const user = await this.userService.findUserById(userId);

        console.log(user)

        user.hashedRt = hash;

        await this.userService.updateUser(user)
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
}
