// в названии файла указать user-interface.ts
export interface IUser {
  firstName: string;
  lastName: string;
  patronymic: string; // можно обозначить необязательные поля
  email: string;
  phoneNumber: string;
  phoneNumberWork: string;
}