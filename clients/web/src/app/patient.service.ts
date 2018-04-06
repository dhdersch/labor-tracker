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


    return this.http.put<Patient>(url, patient, options).pipe(
      tap(_ => console.log(`fetched patient`))
      // catchError(this.handleError<Patient>(`getPatient`))
    );
  }


  signer(): AWSign.AwsSigner {
    const cfg = {
      region: 'us-east-1',
      service: 'execute-api',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
    }
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

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //
  //     console.error(error);
  //
  //     if (error.status === 404) {
  //       console.log('Patient does not exist yet, so let them create it.')
  //       const patient = new Patient();
  //       return of(patient as T);
  //     }
  //
  //
  //     return of(result as T);
  //   };
  // }


  private handleNotFound () {
    return (error: any): Observable<Patient> => {

      console.error(error);

      console.log('Patient does not exist yet, so let them create it.')
      const patient = new Patient();
      return of(patient);


    };
  }


}
