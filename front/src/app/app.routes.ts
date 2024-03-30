import { Routes } from '@angular/router';
import { LoginPageComponent } from './access/pages/login-page/login-page.component';
import { ChangePasswordPageComponent } from './access/pages/change-password-page/change-password-page.component';
import { LandingPageComponent } from './work-team/pages/landing-page/landing-page.component';
import { TeamViewComponent } from './work-team/pages/team-view/team-view.component';
import { ViewProfilePageComponent } from './user-profile/pages/view-profile-page/view-profile-page.component';
import { AddTeacherPageComponent } from './guide-teacher/pages/add-teacher-page/add-teacher-page.component';
import { EditTeacherPageComponent } from './guide-teacher/pages/edit-teacher-page/edit-teacher-page.component';
import { ViewStudentsPageComponent } from './students/pages/view-students-page/view-students-page.component';
import { AddStudentPageComponent } from './students/pages/add-student-page/add-student-page.component';
import { EditStudentPageComponent } from './students/pages/edit-student-page/edit-student-page.component';

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
  },
  {
    path: 'addTeacher',
    component: AddTeacherPageComponent
  },
  {
    path: 'editTeacher',
    component: EditTeacherPageComponent
  },
  {
    path: 'viewStudents',
    component: ViewStudentsPageComponent
  },
  {
    path: 'addStudent',
    component: AddStudentPageComponent
  },
  {
    path: 'editStudent',
    component: EditStudentPageComponent
  }
];
