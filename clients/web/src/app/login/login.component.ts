import { Component, OnInit, NgZone } from '@angular/core';
import * as AWS from 'aws-sdk';
import {GoogleSignInSuccess} from 'angular-google-signin';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import AuthResponse = gapi.auth2.AuthResponse;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private zone: NgZone, private authService: AuthService) { }

  private myClientId = '430167994732-22vk3tgdsdl1m74ctpqjf92p7lfk6l53.apps.googleusercontent.com';

  onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    const googleUser: gapi.auth2.GoogleUser = event.googleUser;

    const authResponse: AuthResponse = googleUser.getAuthResponse();

    const profile = googleUser.getBasicProfile();
    console.log('Google ID', profile.getId());
    console.log('Google Email', profile.getEmail());
    console.log('Google Name', profile.getName());

    localStorage.setItem('google_expires_at', authResponse.expires_at);
    localStorage.setItem('google_id_token', authResponse.id_token);
    localStorage.setItem('google_name', profile.getName());

    const r_var = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:5e49b927-e94b-48b6-b0ad-a1f9b2a26eb0', // your identity pool id here
      Logins: {
        'accounts.google.com': authResponse.id_token
      }
    });

    AWS.config.credentials = r_var;
    const r = this.router;
    const zone = this.zone;
    r_var.get(function(err) {
      // console.log(AWS.config.credentials);

      const item = {
        'accessKeyId': AWS.config.credentials.accessKeyId,
        'sessionToken': AWS.config.credentials.sessionToken,
        'secretAccessKey': AWS.config.credentials.secretAccessKey,
        'expireTime': AWS.config.credentials['expireTime']
      };

      localStorage.setItem('aws_credentials', JSON.stringify(item));

      zone.run(() => r.navigate(['/patient']));
    });
  }

  ngOnInit() {}

}
