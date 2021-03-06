import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Partogram } from './partogram';
import * as AWSign from 'aws-sign-web';
import * as AWS from 'aws-sdk';
import {AuthService} from './auth.service';
import {Part} from 'aws-sdk/clients/s3';
import {Measurement, MeasurementBackend} from './measurement';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PartogramService {

  private partogramURL = 'https://9mfr0sm6pj.execute-api.us-east-1.amazonaws.com/dev/partograms';  // URL to web api

  constructor(
    private http: HttpClient, private authService: AuthService) {
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

    // console.log(cfg);
    return new AWSign.AwsSigner(cfg);
  }


  deletePartogram(partogram_id: string): Observable<void> {
    const url = `${this.partogramURL}/${partogram_id}`;
    const signer = this.signer();
    const request = {
      method: 'DELETE',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const signed = signer.sign(request);
    const options = {
      headers: new HttpHeaders(signed)
    };

    return this.http.delete<void>(url, options);
  }


  addPartogram(labor_start_time: number, patient_initials?: string, patient_room?: string): Observable<Partogram> {
    const url = `${this.partogramURL}`;
    const signer = this.signer();

    const p: Partogram = new Partogram();
    p.initials = patient_initials;
    p.labor_start_time = labor_start_time;
    p.room = patient_room;

    const request = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: p,
    };

    const signed = signer.sign(request);
    const options = {
      headers: new HttpHeaders(signed)
    };

    return this.http.post<Partogram>(url, p, options);
  }


  deleteMeasurement(partogram_id: string, time: number): Observable<void> {
    const url = `${this.partogramURL}/${partogram_id}/measurements/${time}`;
    const signer = this.signer();

    const request = {
      method: 'DELETE',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const signed = signer.sign(request);
    const options = {
      headers: new HttpHeaders(signed)
    };
    return this.http.delete<void>(url, options);
  }

  addMeasurement(partogram_id: string, dilation: number, time: Date) {

    const url = `${this.partogramURL}/${partogram_id}/measurements`;
    const signer = this.signer();

    const measurement = new MeasurementBackend();
    measurement.dilation = dilation;
    measurement.time = parseInt((time.getTime() / 1000).toFixed(0), 10);

    const request = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: measurement,
    };

    const signed = signer.sign(request);

    const options = {
      headers: new HttpHeaders(signed)
    };
    return this.http.post<Measurement>(url, measurement, options);

  }

  convertMeasurements(measurementsList: any[]): Array<Measurement> {
    const measurements: Array<Measurement> = [];
    for (const m of measurementsList) {
      const m2 = new Measurement(m['time'], m['dilation']);
      m2.id = m['id'];
      measurements.push(m2);
    }
    return measurements;
  }

  getMeasurements(partogram_id: string): Observable<Measurement[]> {
    const url = `${this.partogramURL}/${partogram_id}/measurements`;
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

    return this.http.get(url, options).pipe(
      tap(s => {
        console.log(s);
      }),
      map(response => {
        return this.convertMeasurements(response['measurements']);
      })
    );
  }


  getPartograms(): Observable<Partogram[]> {
    const url = `${this.partogramURL}`;
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

    return this.http.get(url, options).pipe(
      tap(s => {
        console.log(s);
      }),
      map(response => {
        return response['partograms'];
      })
    );

  }

  getPartogram(partogram_id: string): Observable<Partogram> {
    const url = `${this.partogramURL}/${partogram_id}`;
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

    return this.http.get<Partogram>(url, options).pipe(
      tap(s => {
        console.log(s);
      }),
    );

  }




  private handleNotFound () {
    return (error: any): Observable<Array<Partogram>> => {

      console.error(error);

      console.log('Return empty partogram');

      const partograms: Array<Partogram> = [];

      return of(partograms);
    };
  }


}
