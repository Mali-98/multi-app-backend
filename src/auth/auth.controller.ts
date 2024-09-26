import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard for securing routes
import { LocalAuthGuard } from 'src/auth/local-auth.guard'; // Create this guard for local authentication

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register') // Endpoint for user registration
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @UseGuards(LocalAuthGuard) // Protect this route with the local authentication guard
  @Post('login') // Endpoint for user login
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
