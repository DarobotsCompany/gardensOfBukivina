import { IsPasswordsMatchingConstraint } from '../../../common/decorators/is-passwords-matching-constraint.decorator';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CreateAdministratorDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @Validate(IsPasswordsMatchingConstraint)
    @IsString()
    @IsNotEmpty()
    repeatPassword: string;
}
