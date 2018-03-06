import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';
import { PatientsService, DataPoints, Point } from '../patients.service';
import { Http } from '@angular/http';
import { select } from 'd3-ng2-service/src/bundle-d3';

@Component({
  selector: '.app-partogram',
  templateUrl: './partogram.component.html',
  styleUrls: ['./partogram.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PartogramComponent implements OnInit {
    private d3: D3;
    private parentNativeElement: any;
    private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    private serviceSubscription;
    apiDilationsUrl: String = 'http://localhost:8080/dilations';
    currentDilation = 0;
    currentDuration = 0;

    constructor(element: ElementRef, private ngZone: NgZone,
                d3Service: D3Service, private patientService: PatientsService,
                private http: Http) {
        this.d3 = d3Service.getD3();
        this.patientService = patientService;
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        this.serviceSubscription = this.patientService.onChanged.subscribe({
            next: async (data: DataPoints[]) => {
                // console.log(event);
                while (data.length > 1 && !data[0] && !data[1]) {
                    await this.sleep(200);
                    data = this.patientService.getDataPoints();
                }
                this.render(data);
                this.updateInput(data);
            }
        });
        this.render(this.patientService.getDataPoints());
    }

    updateInput(dataPoints) {
        let lastPoint:  Point = null;
        if (dataPoints.length > 0 && dataPoints[0] !== undefined) {
            if (dataPoints[0].values.length > 0) {
                lastPoint = dataPoints[0].values[dataPoints[0].values.length - 1];
                // update remaining dilation points
                this.patientService.remainingDilations = [];
                for (let i = lastPoint.hours + 1; i <= 10; i++) {
                    this.patientService.remainingDilations.push(i);
                }

                // update remaining duration points
                this.patientService.remainingDurations = [];
                for (let i = lastPoint.duration + 1; i <= 20; i += 0.5) {
                    this.patientService.remainingDurations.push(i);
                }
            }
        } else {
            this.patientService.remainingDilations = [];
            this.patientService.remainingDurations = [];
            for (let i = 4; i < 11; i++) {
                this.patientService.remainingDilations.push(i);
            }
            for (let i = 4; i < 21; i++) {
                this.patientService.remainingDurations.push(i);
            }
        }

        this.currentDilation = this.patientService.remainingDilations.length > 0 ? this.patientService.remainingDilations[0] : null;
        this.currentDuration = this.patientService.remainingDurations.length > 0 ? this.patientService.remainingDurations[0] : null;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    render(dataPoints) {
        if (!dataPoints[0]) {
            return;
        }
        const self = this;
        const d3 = this.d3;
        let d3ParentElement: any;
        let svg: any;
        let name: string;
        let yVal: number;
        const colors: any = [];
        const padding: number = 25;
        const margin = {top: 20, right: 20, bottom: 30, left: 50};
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
        let xScale: any;
        let yScale: any;
        let xColor: any;
        let xAxis: any;
        let yAxis: any;

        // var parseDate = d3.timeParse('%Y');
        if (this.parentNativeElement !== null) {
            svg = d3.select('svg');
            svg.selectAll('*').remove();
            const data = dataPoints;

            const duration = 250;

            const lineOpacity = '0.25';
            const lineOpacityHover = '0.85';
            const otherLinesOpacityHover = '0.1';
            const lineStroke = '2.5px';
            const lineStrokeHover = '3.5px';

            const circleOpacity = '0.85';
            const circleOpacityOnLineHover = '1';
            const circleRadius = 3;
            const circleRadiusHover = 6;

            const mouseOver = function(d, i) {
                d3.selectAll(`.line${i}`)
                            .style('opacity', otherLinesOpacityHover);
                d3.selectAll(`.circle`)
                            .style('opacity', circleOpacityOnLineHover)
                            .style('stroke-width', 1)
                            .style('stroke', 'black');
                d3.selectAll(`.legend${i}`)
                            .style('stroke-width', .5)
                            .style('stroke', 'black');
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style('stroke-width', lineStrokeHover)
                    .style('cursor', 'pointer');
            };

            const mouseOut = function(d, i) {
                d3.selectAll(`.line${i}`)
                            .style('opacity', lineOpacity);
                d3.selectAll('.circle')
                            .style('opacity', circleOpacity)
                            .style('stroke-width', 0);
                d3.selectAll(`.legend${i}`)
                            .style('stroke-width', 0);
                d3.select(this)
                    .style('stroke-width', lineStroke)
                    .style('cursor', 'none');
            };

            /* Scale */
            xScale = d3.scaleTime()
                .domain([0, 20])
                .range([0, width - margin.left]);

            yScale = d3.scaleLinear()
                .domain([4, 10])
                .range([height - margin.top, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            /* Area Below */
            const areaBelow = d3.area<Point>()
                .x((d: Point) => xScale(d.duration))
                .y0(height - margin.top)
                .y1((d: Point) => yScale(d.hours));

            /* Area Below */
            const areaAbove = d3.area<Point>()
                .x((d: Point) => xScale(d.duration))
                .y0(0)
                .y1((d: Point) => yScale(d.hours));

            /* Add SVG */
            svg.attr('width', `${width}px`)
                .attr('height', `${height}px`)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            /* Add line into SVG */
            const line = d3.line<Point>()
                .curve(d3.curveCatmullRom)
                .x((d: Point) => xScale(d.duration))
                .y((d: Point) => yScale(d.hours));
            const transition = d3.transition()
                .duration(500)
                .ease(d3.easeLinear);

            const lines = svg.append('g')
                .attr('class', 'lines');

            lines.selectAll('.line-group')
                .data(data).enter()
                .append('g')
                .attr('class', 'line-group')
                .on('mouseover', function(d, i) {
                    svg.append('text')
                    .attr('class', 'title-text')
                    .style('fill', d.color)
                    .text(d.name)
                    .attr('text-anchor', 'middle')
                    .attr('x', (margin.left) + 100)
                    .attr('y', 5);
                })
                .on('mouseout', d => svg.select('.title-text').remove())
                .append('path')
                .attr('class', (d, i) => `line line${i}`)
                .attr('d', d => areaBelow(d.values))
                .style('stroke', (d, i) => d.color)
                .style('fill', (d, i) => d.color)
                .style('opacity', lineOpacity)
                .style('stroke-width', lineStroke)
                .on('mouseover', mouseOver)
                .on('mouseout', mouseOut);

            /* Add circles in the line */
            lines.selectAll('.circle-group')
                .data(data).enter()
                .append('g')
                .style('fill', (d, i) => d.color)
                .selectAll('circle')
                .data(d => d.values).enter()
                .append('g')
                .attr('class', (d, i) => `circle circle${i}`)
                .on('mouseover', function(d) {
                    d3.select(this)
                    .style('cursor', 'pointer')
                    .style('stroke-width', 1)
                    .style('stroke', 'black')
                    .append('text')
                    .attr('class', 'text')
                    .text(`${d.duration} hrs, ${d.hours} cm`)
                    .attr('x', (p: Point) => xScale(p.duration) + 5)
                    .attr('y', (p: Point) => yScale(p.hours) - 10);
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                    .style('cursor', 'none')
                    .style('stroke-width', 0)
                    .selectAll('.text').remove();
                })
                .append('circle')
                .attr('cx', d => xScale(d.duration))
                .attr('cy', d => yScale(d.hours))
                .attr('r', circleRadius)
                .style('opacity', circleOpacity)
                .on('mouseover', function(d) {
                    d3.select(this)
                        .attr('r', circleRadiusHover);
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .attr('r', circleRadius);
                });

            lines.transition(transition);
            lines.exit().remove();
            /* Add Axis into SVG */
            xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d3.format('.1f'));
            yAxis = d3.axisLeft(yScale).ticks(7).tickFormat(d3.format('.0s'));

            const xLine = svg.append('g');
            xLine.transition(transition)
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${height - margin.top})`)
                .call(xAxis);
            xLine.append('text')
                .transition(transition)
                .attr('x', `${width - margin.left - 25}`)
                .attr('y', -10)
                .attr('fill', '#000')
                .text('Duration (hrs)');

            const yLine = svg.append('g');
            yLine.transition(transition)
                .attr('class', 'y axis')
                .call(yAxis);
            yLine.append('text')
                .transition(transition)
                .attr('y', 15)
                .attr('transform', 'rotate(-90)')
                .attr('fill', '#000')
                .text('Dilation (inches)');

            // Nest the entries by series
            const dataNest = d3.nest()
                .key((d: DataPoints) => d.name)
                .entries(data);

            const legendSpace = width / dataNest.length; // spacing for the legend

            // Loop through each series / key
            const legendY = height + margin.top;
            const legendX = margin.left + 10;
            dataNest.forEach(function(d, i) {
                const legend = svg.append('circle');
                legend.transition(transition);
                legend.attr('cx', legendX + (legendSpace * i) - 15)  // space legend
                    .attr('cy', legendY - 5)
                    .attr('r', '0.4em')
                    .attr('class', `legend${i}`)    // style the legend
                    .style('fill', data[i].color);

                // Add the Legend
                const legendText = svg.append('text');
                legendText.transition(transition);
                legendText.attr('x', legendX + (legendSpace * i))  // space legend
                    .attr('y', legendY)
                    .attr('class', `legend${i}`)    // style the legend
                    .style('fill', data[i].color)
                    .text(d.key);
            });
        }
    }

    onNewDilationClick() {
        const patient = this.patientService.getCurrentPatient();
        this.http.post(this.apiDilationsUrl + `/${patient.patientId}`,
                      {dilation: this.currentDilation,
                       duration: this.currentDuration})
        .toPromise()
        .then((response) => {
            if (response.ok) {
                const dataPoints = this.patientService.getDataPoints();
                dataPoints[0].values.push(new Point(this.currentDilation, this.currentDuration));
                this.patientService.getPatientStatus(this.patientService.getCurrentPatient());
                this.updateInput(dataPoints);
                this.render(dataPoints);
            }
        });
    }

    cleanup() {
        this.serviceSubscription.unsubscribe();
    }
}
