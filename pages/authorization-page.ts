import { Locator, Page } from "@playwright/test";
import { IAuthorizationForm } from "../interfaces/authorization-form";

export class AuthorizationPage {
  public readonly page: Page;
  private readonly loginInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitFormButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitFormButton = this.page.locator('pb-button[type=submit] button');
    this.loginInput = this.page.locator('pb-input[formcontrolname="login"] input[type=text]');
    this.passwordInput = this.page.locator('pb-password input')
  }

  public async open(): Promise<void> {
    await this.page.goto(process.env.LK_URL!);
  }

  public async auth(details: IAuthorizationForm): Promise<void> {
    await this.loginInput.fill(details.login);
    await this.passwordInput.fill(details.password);
    await this.submitFormButton.click();
  }
}