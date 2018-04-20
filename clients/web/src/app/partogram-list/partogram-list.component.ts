import { Component, OnInit } from '@angular/core';
import {PartogramService} from '../partogram.service';
import {Partogram} from '../partogram';
import {AddPartogramComponent} from '../add-partogram/add-partogram.component';
import {MatDialog} from '@angular/material';
import {Patient} from '../patient';
import {PatientService} from '../patient.service';

@Component({
  selector: 'app-partogram-list',
  templateUrl: './partogram-list.component.html',
  styleUrls: ['./partogram-list.component.css']
})
export class PartogramListComponent implements OnInit {
  partograms: Partogram[] = [];
  patient: Patient;
  constructor(private partogramService: PartogramService, private dialog: MatDialog, private patientService: PatientService) {}

  ngOnInit() {
    console.log('PartogramDetailComponent - ngAfterViewInit');
    this.patientService.getPatient().subscribe((patient) => {
      this.patient = patient;
      this.getPartograms();
    });
  }

  getPartograms(): void {
    this.partogramService.getPartograms()
      .subscribe(partograms => this.partograms = partograms);
  }

  openAddPartogramDialog() {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(AddPartogramComponent, {
      height: '355px',
      width: '525px',
      panelClass: 'add-measurement-modal',
      hasBackdrop: true,
      data: {
        patient_initials: this.patient.initials,
        patient_room: this.patient.room_number,
      },
    }).afterClosed().subscribe(() =>
      this.getPartograms()
    );

  }

  convertUnixDate(t: number): Date {
    return new Date(t * 1000);
  }

  removePartogram(partogram_id: string): void {
    this.partogramService.deletePartogram(partogram_id).subscribe(r => {
      console.log('removed partogram');
      this.getPartograms();
    });
  }
}
