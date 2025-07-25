import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CreateAdministratorDto } from 'src/admin/administrators/dto/create-administrator.dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
    validate(repeatPassword: string, args: ValidationArguments) {
        const obj = args.object as CreateAdministratorDto;
        return obj.password === repeatPassword;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Passwords do not mutch';
    }
}