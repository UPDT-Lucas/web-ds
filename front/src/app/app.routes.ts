import { Routes } from '@angular/router';
import { LoginPageComponent } from './access/pages/login-page/login-page.component';
import { ChangePasswordPageComponent } from './access/pages/change-password-page/change-password-page.component';
import { LandingPageComponent } from './work-team/pages/landing-page/landing-page.component';
import { ViewProfilePageComponent } from './user-profile/pages/view-profile-page/view-profile-page.component';
import { TeamViewComponent } from './work-team/pages/team-view/team-view.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'teamView',
    component: TeamViewComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordPageComponent
  },
  {
    path: 'viewProfile',
    component: ViewProfilePageComponent
  }
];
