import { Injectable } from '@angular/core';
import {Credentials} from 'aws-sdk';
import {Observable} from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthService {

  constructor() { }

  redirectUrl: string;

  isAuthenticated(): boolean {

    if (AWS.config.credentials == null) {
      return false;
    }

    return true;

    // const expiration = localStorage.getItem('google_expires_at');
    // const token = localStorage.getItem('google_id_token');
    //
    // if (token === null) {
    //   return false;
    // }
    //
    // if (expiration == null) {
    //   return false;
    // }
    //
    // const expirationDate = new Date(expiration * 1000)
    //
    // console.log(expirationDate);
    // return Date.now() < expirationDate;

  }







  }
