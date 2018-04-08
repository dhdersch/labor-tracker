import { Component, OnInit, NgZone } from '@angular/core';
import {PatientService} from '../patient.service';
import {Patient} from '../patient';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  patient: Patient = null;

  constructor(private patientService: PatientService, private zone: NgZone) {}


  ngOnInit() {
    console.log('PatientDetailComponent - ngOnInit');
    this.getPatient();
  }

  getPatient(): void {
    this.patientService.getPatient()
      .subscribe(patient => this.patient = patient);
  }

  save(): void {
    this.patientService.updatePatient(this.patient).subscribe(patient => this.patient = patient);
  }
}
