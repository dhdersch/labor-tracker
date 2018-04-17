import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewEncapsulation,Inject } from '@angular/core';

import * as downloader from 'save-svg-as-png';

import {PartogramService} from '../partogram.service';
import {Measurement, MeasurementData} from '../measurement';
import {ActivatedRoute} from '@angular/router';
import { D3Service, D3, Selection} from 'd3-ng2-service';
import {PatientService} from '../patient.service';
import {Patient,DataPoints,Point} from '../patient';
import {AddMeasurementComponent} from '../add-measurement/add-measurement.component';

import {MatDialog, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-partogram',
  templateUrl: './partogram.component.html',
  styleUrls: ['./partogram.component.css'],
  entryComponents: [
    AddMeasurementComponent
  ]
})

export class PartogramComponent implements OnInit {

  private d3: D3;
  private parentNativeElement: any;

  patient: Patient = new Patient();

  partogram_id: string;
  measurements: Measurement[];
  constructor(private partogramService: PartogramService,
              private route: ActivatedRoute,
              private element: ElementRef,
              private d3Service: D3Service,
              private patientService: PatientService,
              private dialog: MatDialog) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  openAddMeasurementDialog() {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(AddMeasurementComponent, {
      height: '400px',
      width: '600px',
      data: {
        partogram_id: this.partogram_id,
      }
    }).afterClosed().subscribe(() =>
      this.getMeasurements()
    );

  }

  getPatientDetails() {
    this.patientService.getPatient().subscribe(patient => {
      this.patient = patient;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.partogram_id = params['partogram_id'];
      this.getMeasurements();
    });
    this.getPatientDetails();
  }

  getMeasurements(): void {
    this.partogramService.getMeasurements(this.partogram_id).subscribe(measurements => {
      this.measurements = measurements;
      this.render(this.measurements);
    });
  }

  getBMI(): number {
    const metric_height = this.patient.height / 39.3700787
    const metric_weight = this.patient.weight / 2.20462
    const BMI = metric_weight / Math.pow(metric_height,2);
    return Math.round(BMI * 100) / 100;
  }

  saveSvg(): void {
    downloader.saveSvgAsPng(document.getElementsByTagName('svg')[0], 'partogram.png', {
        height: document.getElementsByTagName('svg')[0].height.baseVal.value + 100
      });
  }

  removeMeasurement(measurementTime: Date): void {
    console.log('removing measurement with time', measurementTime.getTime() / 1000)
    const sub = this.partogramService.deleteMeasurement(this.partogram_id, measurementTime.getTime() / 1000)
      .subscribe(r => {
          this.getMeasurements();
          sub.unsubscribe();
        }
      );
  }

  render(measurements: Measurement[]): void {
    console.log('initial measurements', measurements);
    if (measurements.length < 2) {
      console.log('There should be at least 2 measurements before rendering the partogram!');
      return;
    }
    console.log('Rendering');
    const d3 = this.d3;
    const svg = d3.select('svg');


    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    svg.selectAll('*').remove();
    svg.attr('width', `${width}px`)
      .attr('height', `${height}px`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    console.log('measurements sort', measurements);

    measurements.sort(this.compareTime);

    console.log(measurements);

    const minMeasurementTime = measurements[0].time
    const minMeasurementDilation = Math.min(...measurements.map(o => o.dilation));
    const maxMeasurementTime = measurements[measurements.length - 1].time
    const maxMeasurementDilation = Math.max(...measurements.map(o => o.dilation));

    const timeScale = d3.scaleTime().domain([minMeasurementTime, maxMeasurementTime]).range([0, width - margin.left]);
    const dilationScale = d3.scaleLinear().domain([minMeasurementDilation, maxMeasurementDilation]).range([height - margin.top, 0]);
    const time_range = (maxMeasurementTime.getTime() - minMeasurementTime.getTime())
    let time_width = {}
    for (let i = 1; i < measurements.length; i++) {
      time_width[measurements[i-1].time.getTime()] = ((measurements[i].time.getTime() - measurements[i-1].time.getTime()) / time_range) * width
    }
    time_width[maxMeasurementTime.getTime()] = width
    const xAxis = d3.axisBottom(timeScale).tickFormat(d3.timeFormat('%H:%M'));
    const yAxis = d3.axisLeft(dilationScale).ticks(10);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)' );

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Value');

    svg.selectAll('bar')
      .data(measurements)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', function(d) { return timeScale(d.time); })
      .attr('width', function(d) { return time_width[d.time.getTime()]; })
      .attr('y', function(d) { return dilationScale(d.dilation); })
      .attr('height', function(d) { return height - dilationScale(d.dilation); });

  }

    getDystociaByBmi(bmi: number): DataPoints {
    const currentBmi = bmi;
    if (currentBmi < 25) {
      return new DataPoints(
          'Dystocia for BMI (< 25)',
          [
              new Point(5, 4.6),
              new Point(6, 7.5),
              new Point(7, 9.5),
              new Point(8, 11.0),
              new Point(9, 12.3),
              new Point(10, 13.9)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 25 && currentBmi < 30) {
      return new DataPoints(
          'Dystocia for BMI (25-30)',
          [
              new Point(5, 5.0),
              new Point(6, 7.9),
              new Point(7, 9.9),
              new Point(8, 11.4),
              new Point(9, 12.7),
              new Point(10, 14.4)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 30 && currentBmi < 35) {
      return new DataPoints(
          'Dystocia for BMI (30-35)',
          [
              new Point(5, 5.2),
              new Point(6, 8.3),
              new Point(7, 10.4),
              new Point(8, 11.9),
              new Point(9, 13.3),
              new Point(10, 15.1)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 35 && currentBmi < 40) {
      return new DataPoints(
          'Dystocia for BMI (35-40)',
          [
              new Point(5, 5.9),
              new Point(6, 9.4),
              new Point(7, 11.7),
              new Point(8, 13.4),
              new Point(9, 14.7),
              new Point(10, 16.6)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 40) {
      return new DataPoints(
        'Dystocia for BMI (> 40)',
        [
            new Point(5, 7.4),
            new Point(6, 11.6),
            new Point(7, 14.1),
            new Point(8, 15.8),
            new Point(9, 17.2),
            new Point(10, 19.1)
        ],
        '#FFCE67'
      );
    }
  }

  compareTime(a, b) {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  }
  compareDilation(a, b) {
    if (a.dilation < b.dilation) {
      return -1;
    }
    if (a.dilation > b.dilation) {
      return 1;
    }
    return 0;
  }


}
