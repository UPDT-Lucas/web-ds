import { Routes } from '@angular/router';
import { LoginPageComponent } from './access/pages/login-page/login-page.component';
import { ChangePasswordPageComponent } from './access/pages/change-password-page/change-password-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordPageComponent
  }
];
