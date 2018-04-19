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
import { PatientService } from './patient.service';
import { PartogramService } from './partogram.service';
import { D3Service } from 'd3-ng2-service';
import { AuthService } from './auth.service';
import { AppRoutingModule } from './app-routing.module';
import { PartogramListComponent } from './partogram-list/partogram-list.component';
import { PartogramComponent } from './partogram/partogram.component';
import { MeasurementsTableComponent } from './measurements-table/measurements-table.component';
import { AddMeasurementComponent } from './add-measurement/add-measurement.component';
import { MatDialogModule } from '@angular/material';
import { AddPartogramComponent } from './add-partogram/add-partogram.component';
import { TrustedProvidersListComponent } from './trusted-providers-list/trusted-providers-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleSignInComponent,
    PatientDetailComponent,
    LoginComponent,
    LogoutComponent,
    PartogramListComponent,
    PartogramComponent,
    AddMeasurementComponent,
    MeasurementsTableComponent,
    AddPartogramComponent,
    TrustedProvidersListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule
  ],
  providers: [D3Service, PatientService, PartogramService, AuthService, MatDialogModule],
  bootstrap: [AppComponent],
  entryComponents: [AddMeasurementComponent, AddPartogramComponent]
})
export class AppModule {}
