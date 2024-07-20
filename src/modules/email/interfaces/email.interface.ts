import { MessagesSendResult } from 'mailgun.js';

//! replace with any email system we will use, mailgun is for boiler

export const IEmailService = Symbol('IEmailService');
export interface IEmailService {
  send({
    email,
    subject,
    templatePath,
    data,
    attachment,
    inline,
  }): Promise<MessagesSendResult>;
}
