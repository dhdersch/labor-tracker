import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Measurement } from '../measurement';
]
@Component({
  selector: 'app-measurements-table',
  templateUrl: './measurements-table.component.html',
  styleUrls: ['./measurements-table.component.css']
})
export class MeasurementsTableComponent implements OnInit {
  private _measurements: Measurement[];

  @Input() measurements: Measurement[];
  @Input() test: string;
  constructor() {}
  @Output() removeMeasurement = new EventEmitter<Date>();
  @Output() openAddMeasurementDialog = new EventEmitter();

  removeMeasurementClicked(measurementTime) {
    this.removeMeasurement.emit(measurementTime);
  }

  openMeasurementDialogClicked() {
    this.openAddMeasurementDialog.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    const measurements: SimpleChange = changes.measurements;
    this._measurements = measurements.currentValue;
  }
  ngOnInit() {
    console.log('this:', this);
  }
}
