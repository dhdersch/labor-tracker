import { Component, OnInit, NgZone } from '@angular/core';
import {AfterViewInit} from '@angular/core';
import {PartogramService} from '../partogram.service';
import {Partogram} from '../partogram';
import {AddMeasurementComponent} from '../add-measurement/add-measurement.component';
import {AddPartogramComponent} from '../add-partogram/add-partogram.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-partogram-list',
  templateUrl: './partogram-list.component.html',
  styleUrls: ['./partogram-list.component.css']
})
export class PartogramListComponent implements OnInit {
  partograms: Partogram[] = [];
  constructor(private partogramService: PartogramService, private dialog: MatDialog) {}

  ngOnInit() {
    console.log('PartogramDetailComponent - ngAfterViewInit');
    this.getPartograms();
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
