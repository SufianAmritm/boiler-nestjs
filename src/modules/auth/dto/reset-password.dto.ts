import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { DUMMY_DATA } from 'src/common/constants';
import { EMAIL_VERIFICATION_TOKEN_TYPE } from 'src/common/constants/enums';

export class ResetPasswordDto {
  @AutoMap()
  @ApiProperty({
    description: 'Please provide a valid email address verification token',
    example: `${DUMMY_DATA.token}`,
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @AutoMap()
  @ApiProperty({
    description: 'Please provide the type of verification token',
    example: EMAIL_VERIFICATION_TOKEN_TYPE.VERIFICATION,
    enum: EMAIL_VERIFICATION_TOKEN_TYPE,
  })
  @IsString()
  @IsEnum(EMAIL_VERIFICATION_TOKEN_TYPE, { each: true })
  tokenType: EMAIL_VERIFICATION_TOKEN_TYPE;

  @AutoMap()
  @ApiProperty({
    description: 'Please provide a strong password',
    example: `${DUMMY_DATA.password}`,
  })
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;
}
