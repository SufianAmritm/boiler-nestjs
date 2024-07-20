import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DUMMY_DATA } from 'src/common/constants';

export class UserVerificationDto {
  @AutoMap()
  @ApiProperty({
    description: 'Please provide a valid email address verification token',
    example: `${DUMMY_DATA.token}`,
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
