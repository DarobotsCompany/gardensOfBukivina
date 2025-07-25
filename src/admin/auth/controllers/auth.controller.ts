import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { IAccessToken } from '../interfaces/access-token.interface';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<IAccessToken> {
        return await this.authService.login(dto);
    }
}
