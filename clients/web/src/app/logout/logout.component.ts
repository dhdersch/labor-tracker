import { Component, OnInit, NgZone } from '@angular/core';
import * as AWS from 'aws-sdk';
import {GoogleSignInSuccess} from 'angular-google-signin';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import AuthResponse = gapi.auth2.AuthResponse;



@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private zone: NgZone, private authService: AuthService) { }

  ngOnInit() {
     const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
        location.href = location.href.replace(
          'logout', 'login');
      });
  }

}
