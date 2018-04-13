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

    const storedCreds = localStorage.getItem('aws_credentials');

    if (storedCreds == null) {
      return false;
    }


    const parsedCreds = JSON.parse(storedCreds);
    const expiration = Date.parse(parsedCreds['expireTime']);

    if (Date.now() >= expiration) {
      return false;
    }
    AWS.config.credentials = new Credentials(parsedCreds['accessKeyId'], parsedCreds['secretAccessKey'], parsedCreds['sessionToken']);

    return true;
  }

  refreshAWSCredentials(): void {
    const storedCreds = localStorage.getItem('aws_credentials');
    const parsedCreds = JSON.parse(storedCreds);
    AWS.config.credentials = new Credentials(parsedCreds['accessKeyId'], parsedCreds['secretAccessKey'], parsedCreds['sessionToken']);
  }

}
