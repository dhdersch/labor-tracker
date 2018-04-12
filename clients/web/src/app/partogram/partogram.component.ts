import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';



import {PartogramService} from '../partogram.service';
import {Measurement} from '../measurement';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-partogram',
  templateUrl: './partogram.component.html',
  styleUrls: ['./partogram.component.css'],
})

export class PartogramComponent implements OnInit {
  partogram_id: string;
  measurements: Measurement[];
  newMeasurement: Measurement = new Measurement();
  constructor(private partogramService: PartogramService, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.partogram_id = params['partogram_id'];
      this.getMeasurements();
    });

  }

  getMeasurements(): void {
    this.partogramService.getMeasurements(this.partogram_id).subscribe(measurements => this.measurements = measurements);
  }

  addNewMeasurement(): void {
    console.log(this.newMeasurement);
    const sub = this.partogramService.addMeasurement(this.partogram_id, +this.newMeasurement.dilation, +this.newMeasurement.time)
      .subscribe(r => {
        this.getMeasurements();
        this.newMeasurement = new Measurement();
        sub.unsubscribe();
      }
    );
  }

}
