import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { GoogleSignInComponent } from 'angular-google-signin';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

// Services
import { PatientService } from './patient.service';
import { D3Service } from 'd3-ng2-service';
import { AuthService } from './auth.service';
import { AppRoutingModule } from './app-routing.module';
import { PartogramListComponent } from './partogram-list/partogram-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleSignInComponent,
    PatientDetailComponent,
    LoginComponent,
    LogoutComponent,
    PartogramListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [D3Service, PatientService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
