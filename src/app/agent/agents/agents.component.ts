import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AgentsService } from './agents.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/admin/super-visor/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'ngx-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit,AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['row', 'queue_name', 'name', 'length'];
  dataSource = new MatTableDataSource<any>();   
  internal = '';
  queue = '';
  controller!: Subscription;

  left = '10vw';
  width = '50vw';
  height = '45vh';

  wait!: boolean;
 
  data = [];
  buttons: any[] = [];
  queuesOfButtons: any[] = [];
  agentStatus = '';
  superVisor = false;
  ringNoAnswerWebSocket: any;
  constructor(public service: AgentsService, private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar,
    private userservice: UsersService) {    
   
  }

  ngOnInit() {
    if (sessionStorage.getItem('device') == 'mobile') {
      this.width = '80vw';
      this.left = '10vw';
      this.height = '30vh';
    }
    this.wait = false;
    this.agentRefreshStatus();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }



  action(button:any) {
    this.wait = true;
    this.service.buttonAction({ button_id: button }).subscribe((data: any) => {
      this.agentStatus = 'وضعیتی ثبت نشده';
      this.buttons = data.data;      
      for (let i = 0; i < data.data.length; ++i)
        if (data.data[i].type == 'resume') {
          this.agentStatus = '';
          this.agentStatus = data.data[i].name;
        }
        this.openSnackBar('تغییر وضعیت', 'عملیات انجام شد');

    }, (error: HttpErrorResponse) => {
      if (error.status > 500 || !error.status) {    
        this.wait = false;
      }
      else
      this.openSnackBar('خطا', 'خطا در انجام عملیات');
      this.wait = false;

    }, () => {
      this.refreshPage();    
      this.wait = false;
    });
  }
  refreshPage() {
    this.userservice.userHistoryForAgentPannel().subscribe((data: any) => {
      this.dataSource.data = data.data;
    }, (error: HttpErrorResponse) => {
      if (error.status > 500 || !error.status) {       
      this.wait = false;
       }
    })


  }

  agentRefreshStatus() {
    this.service.userButtons().subscribe(data => {
      this.buttons = data.data;
      for (let i = 0; i < data.data.length; ++i)
        if (data.data[i].type == 'resume') {
          this.agentStatus = '';
          this.agentStatus = data.data[i].name;
        }

      for (let i = 0; i < this.buttons.length; ++i) {
        if (!this.queuesOfButtons.includes(this.buttons[i]['queue_name'])) {
          this.queuesOfButtons.push(this.buttons[i]['queue_name']);
        }

      };
      this.refreshPage();
    });
  }


  exit() {
    this.service.agentStatus = 'normal';
    this.cdr.detectChanges();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

}
