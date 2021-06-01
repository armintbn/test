import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/auth/login-service.service';

@Component({
  selector: 'app-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.scss']
})
export class AgentHeaderComponent {
  fullName=  sessionStorage.getItem('full_name');
  constructor(private loginService: LoginServiceService, private routes: Router) {}

  logout(){
    this.loginService.logout().subscribe(data =>{      
    });

    sessionStorage.clear();
    this.routes.navigateByUrl('login');
  
  }


}