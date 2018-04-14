import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Patient } from './patient';
import * as AWSign from 'aws-sign-web';
import * as AWS from 'aws-sdk';
import {AuthService} from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PatientService {

  private patientUrl = 'https://9mfr0sm6pj.execute-api.us-east-1.amazonaws.com/dev/patient';  // URL to web api

  constructor(
    private http: HttpClient, private authService: AuthService) {
  }
  updatePatient(patient: Patient): Observable<Patient> {

    const url = `${this.patientUrl}/update`;
    const signer = this.signer();
    const request = {
      method: 'PUT',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: patient,
    };

    const signed = signer.sign(request);

    const options = {
      headers: new HttpHeaders(signed)
    };

    if (patient.initials === undefined || patient.initials.toString().length == 0){
      alert('No initials provided');
      return;
    }else if (patient.initials.toString().length > 4){
      alert('Initials too long - maximum 4 characters');
      return;
    }

    if (patient.age === undefined || patient.age.toString().length == 0){
      alert('No age provided');
      return;
    }else if (!Number.isInteger(parseInt(patient.age.toString()))){
      alert('Invalid age provided');
      return;
    }else {
      patient.age = parseInt(patient.age.toString());
    }

    if (patient.num_past_vaginal_births === undefined || patient.num_past_vaginal_births.toString().length == 0){
      alert('No number of past vaginal births provided');
      return;
    }else if (!Number.isInteger(parseInt(patient.num_past_vaginal_births.toString()))){
      alert('Invalid number of past vaginal births provided');
      return;
    }else {
      patient.num_past_vaginal_births = parseInt(patient.num_past_vaginal_births.toString());
    }

    if (patient.height === undefined || patient.height.toString().length == 0){
      alert('No height provided');
      return;
    }else if (!Number.isInteger(parseInt(patient.height.toString()))){
      alert('Invalid height provided');
      return;
    }else {
      patient.height = parseInt(patient.height.toString());
    }

    if (patient.weight === undefined || patient.weight.toString().length == 0){
      alert('No weight provided');
      return;
    }else if (!Number.isInteger(parseInt(patient.weight.toString()))){
      alert('Invalid weight provided');
      return;
    }else{
      patient.weight = parseInt(patient.weight.toString());
    }
    console.log(patient);


    return this.http.put<Patient>(url, patient, options).pipe(
      tap(_ => console.log(`fetched patient`))
      // catchError(this.handleError<Patient>(`getPatient`))
    );
  }


  signer(): AWSign.AwsSigner {
    this.authService.refreshAWSCredentials();
    const cfg = {
      region: 'us-east-1',
      service: 'execute-api',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
    };

    console.log(cfg);
    return new AWSign.AwsSigner(cfg);
  }



  getPatient(): Observable<Patient> {
    const url = `${this.patientUrl}`;
    const signer = this.signer();
    const request = {
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: null
    };

    const signed = signer.sign(request);

    const options = {
      headers: new HttpHeaders(signed)
    };

    return this.http.get<Patient>(url, options).pipe(
      tap(_ => console.log(`fetched patient`)),
      catchError(this.handleNotFound())
    );
  }

  private handleNotFound () {
    return (error: any): Observable<Patient> => {

      console.error(error);

      console.log('Patient does not exist yet, so let them create it.');
      const patient = new Patient();
      if (localStorage.getItem('google_name')){
        const initials = (localStorage.getItem('google_name').match(/\b\w/g) || []);
        patient.initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
      }
      return of(patient);


    };
  }


}
