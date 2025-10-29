import { FrameLocator, Locator, Page } from "@playwright/test";
import { IUser } from "../interfaces/user";

export class UsersPage {
  public readonly page: Page;
  private readonly frame: FrameLocator;
  private readonly addUserButton: Locator;
  private readonly userCards: Locator;
  private readonly consedentToDeletion: Locator;
  private readonly lastNameInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly patronymicInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly phoneNumberWorkInput: Locator;
  private readonly submitFormButton: Locator;

  constructor(page: Page) {
    this.page = page;  
    this.frame = page.frameLocator('.main-iframe');
    this.addUserButton = this.frame.locator('#create-user'); 
    this.userCards = this.frame.locator('[id*=user-item]');
    this.consedentToDeletion = this.frame.locator('[data-apply="confirmation"]');
    this.lastNameInput = this.frame.locator('#user_last_name');
    this.firstNameInput = this.frame.locator('#user_first_name');
    this.patronymicInput = this.frame.locator('#user_patronymic');
    this.emailInput = this.frame.locator('#user_email');
    this.phoneNumberInput = this.frame.locator('#user_phone_number');
    this.phoneNumberWorkInput = this.frame.locator('#user_phone_number_work');
    this.submitFormButton = this.frame.locator('button[type="submit"]').last();
  }

  public async open(): Promise<void> {
    await this.page.goto(`${process.env.LK_URL!}/users`, { waitUntil: 'domcontentloaded' });
  }

  public async createUser(user: IUser): Promise<void> {
    await this.addUserButton.click();
    await this.fillUserForm(user);
    await this.submitFormButton.click();
  }

  private async fillUserForm(user: IUser): Promise<void> {
    await this.lastNameInput.fill(user.lastName);
    await this.firstNameInput.fill(user.firstName);
    await this.patronymicInput.fill(user.patronymic);
    await this.emailInput.fill(user.email);
    await this.phoneNumberInput.fill(user.phoneNumber);
    await this.phoneNumberWorkInput.fill(user.phoneNumberWork);
  }

  public async searchUser(email: string): Promise<Locator> {
    return this.userCards.filter({ hasText: email });
  }

  public async updateUser(currentUserEmail: string, newUser: IUser): Promise<void> {
    const userCard = await this.searchUser(currentUserEmail);
    await userCard.locator('[data-toggle=dropdown]').click(); // можно добавить локатор для открытия дропдауна действий
// в этом случае используется функция, которая возвращает локатор. пример: 
// объявление свойства класаса: private readonly userDropdownByEmail: (email: string) => Locator;
// инициализация: this.userDropdownByEmail = (email: string) => this.userCards.filter({ hasText: email }).locator('[data-toggle=dropdown]');
// использование:
//   public async updateUser(currentUserEmail: string, newUser: IUser): Promise<void> {
//     await this.userDropdownByEmail(currentUserEmail).click();
//     ....
//   }
    await userCard.locator('.edit-user').click(); // можно добавить локатор для редактирования
    await this.fillUserForm(newUser);
    await this.submitFormButton.click();
  }

  public async deleteUser(currentUserEmail: string): Promise<void> {
    const userCard = await this.searchUser(currentUserEmail);
    await userCard.locator('[data-toggle=dropdown]').click();
    await userCard.locator('.delete-user').click(); // можно добавить локатор для удаления
    await this.consedentToDeletion.click();
  }
}