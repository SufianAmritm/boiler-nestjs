import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStartDateLessThanEndDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const startDate = (args.object as unknown)[relatedPropertyName];
    if (!startDate || !endDate) {
      return true;
    }
    return new Date(startDate) < new Date(endDate);
  }
}

export function IsStartDateLessThanEndDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsStartDateLessThanEndDateConstraint,
    });
  };
}
