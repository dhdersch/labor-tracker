import { Component, OnInit, NgZone } from '@angular/core';
import {AfterViewInit} from '@angular/core';
import {PartogramService} from '../partogram.service';
import {Partogram} from '../partogram';

@Component({
  selector: 'app-partogram-list',
  templateUrl: './partogram-list.component.html',
  styleUrls: ['./partogram-list.component.css']
})
export class PartogramListComponent implements OnInit {
  partograms: Partogram[] = [];
  constructor(private partogramService: PartogramService) {}

  ngOnInit() {
    console.log('PartogramDetailComponent - ngAfterViewInit');
    this.getPartograms();
  }

  getPartograms(): void {
    this.partogramService.getPartograms()
      .subscribe(partograms => this.partograms = partograms);
  }

}
