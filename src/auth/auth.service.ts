import {ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from "./user/user.entity";
import {UserService} from "./user/user.service";
import * as bcrypt from 'bcrypt';
import {Tokens} from "../common/types/auth";
import {JwtService} from "@nestjs/jwt";
import { randomBytes } from 'node:crypto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService, 
        private jwtService: JwtService,
        private mailService: MailService,
        private config: ConfigService
        ) {
    }

    async signUp(user: User): Promise<Tokens> {
        try {
        user.password = await this.hashData(user.password);
        const newUser = await this.userService.saveUser(user)

        const tokens = await this.getTokens(newUser);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
        } catch (e) {
            console.log(e)
            throw new ForbiddenException("Register Error")
        }
        
    }

    async signIn(user: User): Promise<Tokens> {
        const findedUser = await this.userService.findUserByEmail(user.email);

        if (!findedUser) throw new ForbiddenException("Access Denied")

        const verify = await bcrypt.compare(user.password, findedUser.password)

        if (!verify) throw  new UnauthorizedException("Incorrect Password")

        const tokens = await this.getTokens(findedUser);

        await this.updateRtHash(findedUser.id, tokens.refresh_token);

        return tokens;
    }

    async refreshToken(userId: number, rt: string) {
        const user = await this.userService.findUserById(userId);

        if (!user) throw new ForbiddenException("Access Denied")

        const verify = await bcrypt.compare(rt, user.hashedRt);

        if (!verify) throw  new UnauthorizedException("Incorrect Password")

        const tokens = await this.getTokens(user);

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

    async confirmEmail(code: string, userId: number): Promise<Tokens> {
        const user = await this.userService.findUserById(userId);

        const verify = bcrypt.compare(code, user.mail_confirmation_code)

        if (!verify) {
            throw new ForbiddenException("Email Code Are Invalid")
        }

        user.mail_confirmed = true;
        user.mail_confirmation_code = null;

        await this.userService.updateUser(user);

        const tokens = await this.getTokens(user);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async sendConfirmation(userId: number) {
        const user = await this.userService.findUserById(userId);

        await this.sendEmailConfirmation(user);

        return;
    }

    async getTokens(user: User): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
                mail_confirmed: user.mail_confirmed
            }, {
                expiresIn: 60 * 15,
                secret: this.config.get('ACCESS_TOKEN_KEY')
            }),
            this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
            }, {
                expiresIn: 60 * 60 * 24,
                secret: this.config.get('REFRESH_TOKEN_KEY')
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

        user.hashedRt = hash;

        await this.userService.updateUser(user)
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    makeCode(length: number) {
        let res = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTXYZW0123456789';
        let charsLength = chars.length;

        for (let i = 0; i < length; i++) {
            res += chars.charAt(Math.floor(Math.random() * charsLength))
        }

        return res;
    }

    async sendEmailConfirmation(user: User) {
        const code = this.makeCode(6);

        console.log(code)

        user.mail_confirmation_code = await this.hashData(code);

        await this.userService.updateUser(user);

        await this.mailService.sendEmailConfirmation(user, code)
    }
}
