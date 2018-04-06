import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {LoginComponent} from './login/login.component';
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {AuthGuard} from './auth.guard';


const routes: Routes = [
  {
    path: 'patient',
    component: PatientDetailComponent,
    canActivate: [
      AuthGuard,
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: PatientDetailComponent,
    canActivate: [
      AuthGuard,
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    AuthGuard,
  ]
})
export class AppRoutingModule { }
