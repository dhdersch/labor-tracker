import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { PatientsService, DataPoints } from '../patients.service';

@Component({
  selector: '.app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientsComponent implements AfterViewInit {
  service: PatientsService;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  selectedRow = 0;
  constructor(service: PatientsService) {
    this.service = service;
  }

  ngAfterViewInit() {
    this.selectedRow = 0;
  }

  onPatientClick(patient, patientIndex, event) {
    this.selectedRow = patientIndex;
    this.service.updateCurrentPatient(patientIndex);
  }

}
