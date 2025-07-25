import { IsEmail, IsOptional, IsString, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint } from '../../../common/decorators/is-passwords-matching-constraint.decorator';

export class UpdateAdministratorDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @Validate(IsPasswordsMatchingConstraint)
    @IsString()
    @IsOptional()
    repeatPassword?: string;
}
