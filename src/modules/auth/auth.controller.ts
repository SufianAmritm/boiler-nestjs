import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserVerificationDto } from './dto/user-verification.dto';
import { TokenType } from './type/auth.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign Up' })
  async signUp(@Body() signupDto: SignUpDto): Promise<string | number> {
    return this.authService.signUp(signupDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(@Body() signInDto: SignInDto): Promise<TokenType> {
    return this.authService.signIn(signInDto);
  }

  @Patch('verify')
  @ApiOperation({ summary: 'user verification' })
  async verify(
    @Query() userVerificationDto: UserVerificationDto,
  ): Promise<string> {
    const { token } = userVerificationDto;
    return this.authService.verify(token);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Forget Password' })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<string> {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    const { token, password, tokenType } = resetPasswordDto;
    return this.authService.resetPassword(token, password, tokenType);
  }
}
