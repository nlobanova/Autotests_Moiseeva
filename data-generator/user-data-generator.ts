import { faker } from '@faker-js/faker/locale/ru';
import { IUser } from '../interfaces/user';

export class UserDataGenerator {
  static generateUser(): IUser {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      patronymic: faker.person.middleName(),
      email: faker.internet.email(),
      phoneNumber: `+${faker.number.int({ min: 79000000000, max: 79999999999 })}`,
      phoneNumberWork: `+${faker.number.int({ min: 79000000000, max: 79999999999 })}`
    };
  }
}