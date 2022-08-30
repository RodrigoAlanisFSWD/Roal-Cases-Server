import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {User} from "./user/user.entity";
import {Tokens} from "../common/types/auth";
import {AtGuard, RtGuard} from "../common/guards";
import {GetCurrentUser} from "../common/decorators";
import { MailGuard } from 'src/common/guards/mail.guard';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/sign-up")
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() user: User): Promise<Tokens> {
        return this.authService.signUp(user);
    }

    @Post("/sign-in")
    @HttpCode(HttpStatus.OK)
    signIn(@Body() user: User): Promise<Tokens> {
        return this.authService.signIn(user);
    }

    @UseGuards(AtGuard)
    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser('sub') userId: number) {
        return this.authService.logout(userId);
    }

    @UseGuards(RtGuard)
    @Post("/refresh")
    @HttpCode(HttpStatus.OK)
    refreshToken(@GetCurrentUser() user: any) {
        return this.authService.refreshToken(user['sub'], user['refreshToken']);
    }

    @UseGuards(AtGuard, MailGuard)
    @Get("/profile")
    @HttpCode(HttpStatus.OK)
    getProfile(@GetCurrentUser('sub') userId: number): Promise<User> {
        return this.authService.getProfile(userId)
    }

    @UseGuards(AtGuard)
    @Post("/confirm_email/:code")
    @HttpCode(HttpStatus.OK)
    confirmEmail(@Param("code") code: string, @GetCurrentUser('sub') userId: number): Promise<Tokens> {
        return this.authService.confirmEmail(code, userId)
    }

    @UseGuards(AtGuard)
    @Post("/send_confirmation")
    @HttpCode(HttpStatus.OK)
    sendConfirmation(@GetCurrentUser("sub") userId: number) {
        return this.authService.sendConfirmation(userId)
    }
}
