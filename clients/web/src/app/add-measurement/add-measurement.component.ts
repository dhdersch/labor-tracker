import { Component, OnInit, Inject } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Measurement} from '../measurement';
import {PartogramService} from '../partogram.service';



@Component({
  selector: 'app-add-measurement',
  templateUrl: './add-measurement.component.html',
  styleUrls: ['./add-measurement.component.css']
})
export class AddMeasurementComponent implements OnInit {

  newMeasurement = new Measurement();
  partogram_id: string;

  constructor(
    private dialogRef: MatDialogRef<AddMeasurementComponent>,
    @Inject(MAT_DIALOG_DATA) data, private partogramService: PartogramService) {
      this.partogram_id = data.partogram_id;
    }

  ngOnInit() {

  }

  addNewMeasurement(): void {
    console.log(this.newMeasurement);

    const dilationValidationMessage = this.validateDilation(this.newMeasurement.dilation);
    if (dilationValidationMessage != null) {
      window.alert(dilationValidationMessage);
      return;
    }
    const timeValidationMessage = this.validateTime(this.newMeasurement.time);
    if (timeValidationMessage != null) {
      window.alert(timeValidationMessage);
      return;
    }

    const sub = this.partogramService.addMeasurement(this.partogram_id, +this.newMeasurement.dilation, this.newMeasurement.time)
      .subscribe(r => {
          // this.getMeasurements();
          this.newMeasurement = new Measurement();
          sub.unsubscribe();
          this.dialogRef.close();
        }
      );
  }

  validateDilation(dilation: number)  {
    console.log('Validating dilation ' + dilation);
    if (dilation > 25 || dilation < 0) {
      return 'Dilation must be a number between 0 and 25';
    }
    if (dilation === undefined || dilation == null) {
      return 'A dilation value between 0 and 25 must be provided';
    }
    return null;
  }

  // A valid unix timestamp should be 10 digits long & only contain digits
  validateTime(time: Date)  {
    console.log('Validating time ' + time);
    if (time.toString().length < 1) {
      return 'A valid time must be selected';
    }
    return null;
  }


}
