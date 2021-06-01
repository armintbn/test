import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {

  constructor(private route: Router ) {   
    if (sessionStorage.getItem('role') == 'agent')
    this.route.navigateByUrl('agent/dashboard');
   }

  ngOnInit(): void {
  }

}
