import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallboard',
  templateUrl: './wallboard.component.html',
  styleUrls: ['./wallboard.component.scss']
})
export class WallboardComponent implements OnInit {

  constructor(  private route: Router) {
    if (sessionStorage.getItem('role') == 'agent')
    this.route.navigateByUrl('agent/dashboard');
   }

  ngOnInit(): void {
  }

}
