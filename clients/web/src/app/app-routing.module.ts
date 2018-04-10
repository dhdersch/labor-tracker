import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {PartogramListComponent} from './partogram-list/partogram-list.component';
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
    path: 'list-partograms',
    component: PartogramListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
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
