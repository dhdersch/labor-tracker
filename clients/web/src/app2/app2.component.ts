import { Component } from '@angular/core';
import { GoogleSignInSuccess } from 'angular-google-signin';
import * as AWS from 'aws-sdk'

import * as AWSign from 'aws-sign-web'

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app2.component.html',
  styleUrls: ['./app2.component.css']
})

@Injectable()
export class AppComponent {
  title = 'Labor Tracker';

  private myClientId: string = '430167994732-22vk3tgdsdl1m74ctpqjf92p7lfk6l53.apps.googleusercontent.com'

  constructor(private http: HttpClient) { }

  onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    console.log("Successfully authenticated user using Google!")
    let googleUser: gapi.auth2.GoogleUser = event.googleUser;
    let id: string = googleUser.getId();
    let id_token: string = googleUser.getAuthResponse().id_token
    let profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();
    console.log('ID: ' +
      profile
        .getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());

    let r_var = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:5e49b927-e94b-48b6-b0ad-a1f9b2a26eb0', // your identity pool id here
        Logins: {
            'accounts.google.com': id_token
        }
    });

    AWS.config.credentials = r_var



    r_var.get(function(err) {
    	console.log('login error?')
    	console.log(err)


      var cfg = {
        region: "us-east-1",
        service: "execute-api",
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken
      }

      console.log(cfg)


      let signer: AWSign.AwsSigner = new AWSign.AwsSigner(cfg)

      var request = {
        method: 'GET',
        url: 'https://8ca4yrblhj.execute-api.us-east-1.amazonaws.com/test/something',
        headers: {},
      };

      var signed = signer.sign(request)

      request.headers = signed

      console.log(request)



      $.ajax(signed).done(function(d1) {
        console.log("ajax complete")
        console.log(d1)
      })


    })




  }
}