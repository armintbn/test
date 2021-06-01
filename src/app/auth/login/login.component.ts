import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  toDaysDate = new Date();
  toDaysName = new Date().toString().split(' ')[0];
  loginForm: FormGroup;
  dir: any;
  wait = false;
  userNameDirection = 'rtl';
  passwordDirection = 'rtl';
  constructor(fb: FormBuilder, fb2: FormBuilder, private route: Router, private _snackBar: MatSnackBar,
    private service: LoginServiceService, private appService: AppConfigService) {
    this.loginForm = fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      client_secret: [],
      client_id: [],
      grant_type: ['password'],
      scope: [null],
    });
  

    if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone')
      || navigator.userAgent.includes('iPad')) {
      sessionStorage.setItem('device', 'mobile');
    }
    else {
      sessionStorage.setItem('device', 'pc');
    }

    this.appService.loadServerConfig();

  }

  ngOnInit() {
    this.loginForm.controls['username'].valueChanges.subscribe(data => {
      if (this.loginForm.controls['username'].value)
        this.userNameDirection = 'ltr'; else
        this.userNameDirection = 'rtl';
    });
    

    this.loginForm.controls['password'].valueChanges.subscribe(data => {
      if (this.loginForm.controls['password'].value)
        this.passwordDirection = 'ltr'; else
        this.passwordDirection = 'rtl';
    });
    this.loginForm.controls['client_secret'].setValue(this.appService.getServerConfig().backend_auth_client_secret);
    this.loginForm.controls['client_id'].setValue(this.appService.getServerConfig().backend_auth_client_id);    

  }



  loginSubmit() {
    if (this.loginForm.valid) {
      this.wait = true;
      const params = new HttpParams()
        .set('username', this.loginForm.controls['username'].value)
        .set('password', this.loginForm.controls['password'].value)
        .set('client_secret', this.loginForm.controls['client_secret'].value)
        .set('client_id', this.loginForm.controls['client_id'].value)
        .set('grant_type', this.loginForm.controls['grant_type'].value);
      this.service.login(params).subscribe((data: any) => {
        // tslint:disable-next-line:no-console
        sessionStorage.setItem('token', data['access_token']);
        sessionStorage.setItem('useremail', this.loginForm.controls['username'].value.toLowerCase());

        if (sessionStorage.getItem('token')) {
          this.service.userprofile().subscribe(data => {
            sessionStorage.setItem('full_name', data.data.full_name);
            sessionStorage.setItem('userid', data.data.id);
            this.roleDetector(this.loginForm.controls['username'].value);
          })
        }
      }, (error: HttpErrorResponse) => {
        if (error.status == 401 || error.status == 400)
          this.openSnackBar('اطلاعات وارد شده معتبر نیست', String(error.status))
        else
          this.openSnackBar('مشکل در برقراری ارتباط با سرور', String(error.status))
        this.wait = false;
      })


    } else {

      this.wait = false;
    }

  }



 
  roleDetector(email: string) {
    if (this.appService.getConfig().superVisors.findIndex((user: any) => user.toLowerCase() == email.toLowerCase()) > -1) {
      sessionStorage.setItem('role', 'supervisor');
      this.route.navigateByUrl('/supervisor/dashboard');
    }
    else {
      sessionStorage.setItem('role', 'agent');
      this.route.navigateByUrl('/agent/dashboard');
    }
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }


}







