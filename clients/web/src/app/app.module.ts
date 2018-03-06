import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { PartogramComponent } from './partogram/partogram.component';
import { PatientsComponent } from './patients/patients.component';

// Services
import { PatientsService } from './patients.service';
import { D3Service } from 'd3-ng2-service';

@NgModule({
  declarations: [
    AppComponent,
    PartogramComponent,
    PatientsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [D3Service, PatientsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
