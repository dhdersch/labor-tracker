import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { GoogleSignInComponent } from 'angular-google-signin';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { LoginComponent } from './login/login.component';

// Services
import { PatientService } from './patient.service';
import { D3Service } from 'd3-ng2-service';
import { AuthService } from './auth.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    GoogleSignInComponent,
    PatientDetailComponent,
    LoginComponent
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
