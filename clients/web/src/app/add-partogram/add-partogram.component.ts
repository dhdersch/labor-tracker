import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PartogramService} from '../partogram.service';
import {AddMeasurementComponent} from '../add-measurement/add-measurement.component';

@Component({
  selector: 'app-add-partogram',
  templateUrl: './add-partogram.component.html',
  styleUrls: ['./add-partogram.component.css']
})
export class AddPartogramComponent implements OnInit {
  labor_start_time: Date = null;
  patient_initials: string;
  patient_room: string;

  constructor(
    private dialogRef: MatDialogRef<AddMeasurementComponent>,
    @Inject(MAT_DIALOG_DATA) data, private partogramService: PartogramService) {
    this.labor_start_time = new Date(Date.now());
    this.patient_initials = data.patient_initials;
    this.patient_room = data.patient_room;
  }

  ngOnInit() {
  }

  addNewPartogram(labor_start_time: Date): void {
    this.partogramService.addPartogram(labor_start_time.getTime() / 1000, this.patient_initials, this.patient_room).subscribe(partogram => {
      console.log('Created new partogram', partogram);
      this.dialogRef.close();
    });
  }

  convertUnixDate(t: number): Date {
    return new Date(t * 1000);
  }

}
