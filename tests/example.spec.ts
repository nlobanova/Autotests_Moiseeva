// указать название теста
import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/users-page';
import { IUser } from '../interfaces/user';
import { AuthorizationPage } from '../pages/authorization-page';
import { UserDataGenerator } from '../data-generator/user-data-generator';

test.describe(() => { // добавить название тест-сьюта
  test.describe.configure({ mode: 'serial' });
  let user: IUser;
  let newUser: IUser;

  test.beforeEach('Авторизация', async({ page }) => {
    const authPage = new AuthorizationPage(page);
    await authPage.open();
    await authPage.auth({ login: process.env.LOGIN!, password: process.env.PASSWORD! })
    await expect(page).toHaveURL(`${process.env.LK_URL!}/catalog/projects`);
  });

  test('Добавление пользователя *PROFITBASE-T712*', async ({ page }) => {
    user = UserDataGenerator.generateUser();
    const usersPage = new UsersPage(page);
    await usersPage.open();
    await expect(page).toHaveURL(`${process.env.LK_URL!}/users`);
    await usersPage.createUser(user);
    const userCard = await usersPage.searchUser(user.email);
    await expect(userCard).toBeVisible(); // думаю, в данном случае недостаточно проверить, что есть карточка с email созданного пользователя. + т.к. пользователи создаются без указания отдела продаж, можно дополнительно проверить, что пользователь создается в блоке "Пользователи без группы" 
  });

   test('Редактирование пользователя *PROFITBASE-T715*', async ({ page }) => {
    newUser = UserDataGenerator.generateUser();
    const usersPage = new UsersPage(page);
    await usersPage.open();
    await expect(page).toHaveURL(`${process.env.LK_URL!}/users`);
    await usersPage.updateUser(user.email, newUser);
    const newUserCard = await usersPage.searchUser(newUser.email);
    await expect(newUserCard).toBeVisible(); // тут тоже
  });

    test('Удаление созданного пользователя *PROFITBASE-T1745*', async({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.open();
    await expect(page).toHaveURL(`${process.env.LK_URL!}/users`);
    await usersPage.deleteUser(newUser.email)
    const deletedUserCard = await usersPage.searchUser(newUser.email);
    await expect(deletedUserCard).toBeHidden();
  });
});
