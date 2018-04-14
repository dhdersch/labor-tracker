import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import * as downloader from 'save-svg-as-png';

import {PartogramService} from '../partogram.service';
import {Measurement, MeasurementData} from '../measurement';
import {ActivatedRoute} from '@angular/router';
import { D3Service, D3, Selection} from 'd3-ng2-service';

@Component({
  selector: 'app-partogram',
  templateUrl: './partogram.component.html',
  styleUrls: ['./partogram.component.css'],
})

export class PartogramComponent implements OnInit {

  private d3: D3;
  private parentNativeElement: any;

  partogram_id: string;
  measurements: Measurement[];
  newMeasurement: Measurement = new Measurement();
  constructor(private partogramService: PartogramService, private route: ActivatedRoute, element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.partogram_id = params['partogram_id'];
      this.getMeasurements();
    });
  }

  getMeasurements(): void {
    this.partogramService.getMeasurements(this.partogram_id).subscribe(measurements => {
      this.measurements = measurements;
      this.render(this.measurements);
    });
  }


  validateDilation(dilation: number)  {
    console.log('Validating dilation ' + dilation);
    if (dilation > 11 || dilation < 0) {
        return 'Dilation must be a number between 0 and 11';
     }
     if (dilation === undefined || dilation == null){
       return 'A dilation value between 0 and 11 must be provided';
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

  saveSvg(): void {
    downloader.saveSvgAsPng(document.getElementsByTagName('svg')[0], 'partogram.png', {
        height: document.getElementsByTagName('svg')[0].height.baseVal.value + 100
      });
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
        this.getMeasurements();
        this.newMeasurement = new Measurement();
        sub.unsubscribe();
      }
    );
  }

  removeMeasurement(measurementTime: number): void {
    const sub = this.partogramService.deleteMeasurement(this.partogram_id, measurementTime)
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
    /* Add SVG */
    svg.attr('width', `${width}px`)
      .attr('height', `${height}px`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Convert measurements to a format that d3 understands! (the dates)
    // const transformedMeasurements: MeasurementData[] = [];
    // for (const measurement of measurements) {
    //   const m: MeasurementData = new MeasurementData();
    //   m.time = measurement.time;
    //   m.dilation = measurement.dilation;
    //   transformedMeasurements.push(m);
    // }

    console.log('measurements sort', measurements);

    measurements.sort(this.compareTime);

    console.log(measurements);

    const minMeasurement = measurements[0];
    const maxMeasurement = measurements[measurements.length - 1];

    const timeScale = d3.scaleTime().domain([minMeasurement.time, maxMeasurement.time]).range([0, width - margin.left]);
    const dilationScale = d3.scaleLinear().domain([minMeasurement.dilation, maxMeasurement.dilation]).range([height - margin.top, 0]);
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
      .attr('width', width)
      .attr('y', function(d) { return dilationScale(d.dilation); })
      .attr('height', function(d) { return height - dilationScale(d.dilation); });

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
