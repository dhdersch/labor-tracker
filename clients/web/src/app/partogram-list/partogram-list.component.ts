import { Component, OnInit,NgZone } from '@angular/core';
import {AfterViewInit} from '@angular/core';    
import {PartogramService} from '../partogram.service';
import {Partogram} from '../partogram';

@Component({
  selector: 'app-partogram-list',
  templateUrl: './partogram-list.component.html',
  styleUrls: ['./partogram-list.component.css']
})
export class PartogramListComponent implements AfterViewInit {
	partogram: Partogram = null;
  constructor(private partogramService: PartogramService, private zone: NgZone) {}

   ngAfterViewInit() {
    console.log('PartogramDetailComponent - ngAfterViewInit');
    this.getPartograms();
  }

  getPartograms(): void {
    this.partogramService.getPartograms()
      .subscribe(partogram => this.partogram = partogram);
  }

}
