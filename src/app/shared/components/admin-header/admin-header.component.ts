import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/auth/login-service.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent  {
  fullName=  sessionStorage.getItem('full_name');
  constructor(private loginService: LoginServiceService, private routes: Router) { }

  logout(){
    this.loginService.logout().subscribe(data =>{   
    });
    sessionStorage.clear();
    this.routes.navigateByUrl('login');
  }


}
