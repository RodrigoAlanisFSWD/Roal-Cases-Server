import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join, resolve } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    port: config.get('MAIL_PORT'),
                    secure: false,
                    auth: {
                      user: config.get('MAIL_USER'),
                      pass: config.get('MAIL_PASSWORD'),
                    },
                  },
                  defaults: {
                    from: `"No Reply" <${config.get('MAIL_FROM')}>`,
                  },
                template: {
                    dir: resolve(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    }
                }
            }),
        })
    ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
