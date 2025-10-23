import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/users-page';
import { IUser } from '../interfaces/user';
import { AuthorizationPage } from '../pages/authorization-page';
import { UserDataGenerator } from '../data-generator/user-data-generator';

test.describe(() => {
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
    await expect(userCard).toBeVisible();
  });

   test('Редактирование пользователя *PROFITBASE-T715*', async ({ page }) => {
    newUser = UserDataGenerator.generateUser();
    const usersPage = new UsersPage(page);
    await usersPage.open();
    await expect(page).toHaveURL(`${process.env.LK_URL!}/users`);
    await usersPage.updateUser(user.email, newUser);
    const newUserCard = await usersPage.searchUser(newUser.email);
    await expect(newUserCard).toBeVisible();
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
