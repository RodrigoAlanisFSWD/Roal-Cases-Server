import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/auth/user/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmailConfirmation(user: User, code: string) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome To Roal Cases! Confirm Your Email',
                template: './confirmation',
                context: {
                    name: user.name,
                    code,
                }
            })
        } catch (error) {
            console.log(error)
        }
        
    }
}
