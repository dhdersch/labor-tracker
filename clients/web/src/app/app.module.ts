import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { GoogleSignInComponent } from 'angular-google-signin';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


// Services
import { PatientService } from './patient.service';
import { PartogramService } from './partogram.service';
import { D3Service } from 'd3-ng2-service';
import { AuthService } from './auth.service';
import { AppRoutingModule } from './app-routing.module';
import { PartogramListComponent } from './partogram-list/partogram-list.component';
import {PartogramComponent} from './partogram/partogram.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleSignInComponent,
    PatientDetailComponent,
    LoginComponent,
    LogoutComponent,
    PartogramListComponent,
    PartogramComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [D3Service, PatientService, PartogramService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
