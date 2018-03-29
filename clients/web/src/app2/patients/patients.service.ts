import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PatientsService {

    private apiPatientsUrl = "https://www.google.com"

    constructor(private http: Http) {
        this.getPatientInformation();
      }


    getPatientInformation() {
        this.http.get(this.apiPatientsUrl).subscribe(data => {
            const patients = data.json();

        });
        }



}
