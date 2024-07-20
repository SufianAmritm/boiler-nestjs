import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { DUMMY_DATA } from 'src/common/constants';

export class SignUpDto {
  @AutoMap()
  @ApiProperty({
    description: 'Please provide a valid email address',
    example: `${DUMMY_DATA.email}`,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @AutoMap()
  @ApiProperty({
    description: 'Please provide a name for the user',
    example: `${DUMMY_DATA.name}`,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

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
