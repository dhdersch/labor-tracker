import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {PatientService} from '../patient.service';
import {Patient} from '../patient';
import {DOCUMENT, Location} from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  patient: Patient = null;

  constructor(private patientService: PatientService, private zone: NgZone, private loc: Location,
              @Inject(DOCUMENT) private document: any) {
  }

  domain = '';
  ngOnInit() {
    console.log('PatientDetailComponent - ngOnInit');
    this.getPatient();

    this.domain = this.document.location.origin;

    // console.log(this.loc.normalize('/providers/123'));

  }

  getPatient(): void {
    this.patientService.getPatient()
      .subscribe(patient => this.patient = patient);
  }

  save(): void {
    this.patientService.updatePatient(this.patient).subscribe(patient => this.patient = patient);
  }
}
