import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import * as FormData from 'form-data';
import { readFileSync } from 'fs';
import Mailgun, { MailgunMessageData, MessagesSendResult } from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import { join } from 'path';
import { IEmailService } from './interfaces/email.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly mailgun: Mailgun;

  private readonly mailGunClient: IMailgunClient;

  constructor(private readonly configService: ConfigService) {
    const mailgun = new Mailgun(FormData);
    this.mailGunClient = mailgun.client({
      username: 'support',
      key: this.configService.get<string>('MAILGUN_API_KEY'),
      timeout: 6000,
    });
  }

  async send({
    email,
    subject,
    templatePath,
    data,
    attachment = undefined,
    inline = undefined,
  }): Promise<MessagesSendResult> {
    const filePath = join(__dirname, 'templates', templatePath);
    const file = readFileSync(filePath, {
      encoding: 'utf-8',
    });
    const html = ejs.render(file, {
      email,
      ...data,
    });
    const options: MailgunMessageData = {
      from: this.configService.get<string>('FROM_EMAIL'),
      to: email,
      subject,
      html,
      attachment,
      inline,
    };
    return this.mailGunClient.messages.create(
      this.configService.get<string>('DOMAIN'),
      options,
    );
  }
}
