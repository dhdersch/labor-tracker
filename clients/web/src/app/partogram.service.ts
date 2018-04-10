import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Partogram } from './partogram';
import * as AWSign from 'aws-sign-web';
import * as AWS from 'aws-sdk';
import {AuthService} from './auth.service';

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
    const cfg = {
      region: 'us-east-1',
      service: 'execute-api',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
    }

    console.log(cfg);
    return new AWSign.AwsSigner(cfg);
  }



  getPartograms(): Observable<Partogram> {
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

    return this.http.get<Partogram>(url, options).pipe(
      tap(_ => console.log(`fetched partograms`)),
      catchError(this.handleNotFound())
    );
  }


  private handleNotFound () {
    return (error: any): Observable<Partogram> => {

      console.error(error);

      console.log('Return empty partogram')
      const partogram = new Partogram();
      return of(partogram);


    };
  }


}
