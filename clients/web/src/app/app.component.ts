import { Component } from '@angular/core';
import { GoogleSignInSuccess } from 'angular-google-signin';
import * as AWS from 'aws-sdk'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Labor Tracker';

  private myClientId: string = '430167994732-22vk3tgdsdl1m74ctpqjf92p7lfk6l53.apps.googleusercontent.com'

  onGoogleSignInSuccess(event: GoogleSignInSuccess) {
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
    })
  }
}
