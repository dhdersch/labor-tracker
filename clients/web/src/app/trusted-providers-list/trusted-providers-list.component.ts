import { Component, OnInit } from '@angular/core';
import {PatientService} from '../patient.service';
import {Provider} from '../provider';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-trusted-providers-list',
  templateUrl: './trusted-providers-list.component.html',
  styleUrls: ['./trusted-providers-list.component.css']
})
export class TrustedProvidersListComponent implements OnInit {

  constructor(private patientService: PatientService, private route: ActivatedRoute) { }
  trustedProviders: Provider[];
  newProviderId = '';
  ngOnInit() {


    this.route.params.subscribe(params => {
      this.newProviderId = params['provider_id'];
    });

    this.listTrustedProviders();
  }

  listTrustedProviders() {
    this.patientService.listTrustedProviders().subscribe(providers => {
      this.trustedProviders = providers;
    });
  }

  removeTrustedProvider(provider_id: string) {
    console.log('attempting to remove provider with id', provider_id)
    this.patientService.removeTrustedProvider(provider_id).subscribe(() => {
      this.listTrustedProviders();
    });
  }
  addTrustedProvider() {
    this.patientService.addTrustedProvider(this.newProviderId).subscribe(() => {
      this.newProviderId = '';
      this.listTrustedProviders();
    });
  }


}
