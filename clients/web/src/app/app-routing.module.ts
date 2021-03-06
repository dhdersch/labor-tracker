import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {PartogramListComponent} from './partogram-list/partogram-list.component';
import {AuthGuard} from './auth.guard';
import {PartogramComponent} from './partogram/partogram.component';
import {TrustedProvidersListComponent} from './trusted-providers-list/trusted-providers-list.component';


const routes: Routes = [
  {
    path: 'providers/:provider_id',
    component: TrustedProvidersListComponent,
    canActivate: [
      AuthGuard,
    ]
  },
  {
    path: 'providers',
    component: TrustedProvidersListComponent,
    canActivate: [
      AuthGuard,
    ]
  },
  {
    path: 'patient',
    component: PatientDetailComponent,
    canActivate: [
      AuthGuard,
    ]
  },
  {
    path: 'list-partograms',
    component: PartogramListComponent,
    canActivate: [
      AuthGuard,
    ],
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
    path: 'partograms/:partogram_id',
    component: PartogramComponent,
    canActivate: [
      AuthGuard,
    ],
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
