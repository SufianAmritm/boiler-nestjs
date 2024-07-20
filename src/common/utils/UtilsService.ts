import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from 'crypto';
import * as uuid from 'uuid';

@Injectable()
export class UtilsService {
  constructor(public configService: ConfigService) {}

  getEnvironmentVariable<T>(key: string, defaultValue: T = undefined): T {
    return this.configService.get<T>(key) || defaultValue;
  }

  encrypt(text: string): string {
    const serverKey = this.getEnvironmentVariable<string>('SERVER_KEY');
    const serverIv = this.getEnvironmentVariable<string>('SERVER_IV');
    const cipher = createCipheriv('aes-256-cbc', serverKey, serverIv);
    let encryptedPayload = cipher.update(text, 'utf8', 'hex');
    encryptedPayload += cipher.final('hex');
    return encryptedPayload;
  }

  decrypt(encryptedText: string): string {
    const serverKey = this.getEnvironmentVariable<string>('SERVER_KEY');
    const serverIv = this.getEnvironmentVariable<string>('SERVER_IV');
    const decipher = createDecipheriv('aes-256-cbc', serverKey, serverIv);

    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);
    return decryptedText.toString('utf8');
  }

  sanitize(input: string): string {
    return input.replace(/[^a-zA-Z]/g, '');
  }

  awsUploadKeyBuilder(
    fileName: string,
    folder?: string,
    bucket?: string,
  ): string {
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueIdentifier = uuid.v4().toString();

    let key = `${uniqueIdentifier}-${sanitizedFileName}`;
    if (folder) {
      key = `${folder}/${key}`;
    }
    if (bucket) {
      key = `${bucket}/${key}`;
    }
    return key;
  }

  awsPublicUrlBuilder(bucket: string, key: string, folder?: string): string {
    let url = `https://${bucket}.s3.amazonaws.com/`;
    if (folder) {
      url += `${folder}/`;
    }
    url += key;
    return url;
  }

  encodeAuthHeader(key: string): string {
    return Buffer.from(key).toString('base64');
  }
}
