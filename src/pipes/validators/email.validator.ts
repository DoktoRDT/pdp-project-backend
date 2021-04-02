import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MESSAGE = 'Invalid email format';

@ValidatorConstraint({ name: 'validEmail', async: false })
export class EmailValidator implements ValidatorConstraintInterface {
  public validate(text: string) {
    return REGEX.test(text);
  }

  public defaultMessage() {
    return MESSAGE;
  }
}
