import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentsComponent } from '../agents/agents.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { UsersService } from 'src/app/admin/super-visor/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ngx-calls-report',
  templateUrl: './calls-report.component.html',
  styleUrls: ['./calls-report.component.scss']
})
export class CallsReportComponent  implements OnInit {

  displayedColumns: string[] = ['row', 'queue', 'direction', 'channel','dstchannel','dst','calldate','bill_time'];
  dataSource = new MatTableDataSource<any>();
  panelOpenState = true;
  width = '10%';
  agentsComponent = AgentsComponent;
  form: FormGroup;
  firstLoad = false;
  details! : FormGroup;
  dataholder = [];
  searchString = '?';
  today = new Date();
  lastmonth = new Date(this.today.getTime() - (60*60*1000));
  from =  formatDate(this.lastmonth,'YYYY-MM-dd','en');
  to =  formatDate(this.today,'YYYY-MM-dd','en');;
  paginate:any = [];
  current_page = 0;
  fromDate: any = '';
  toDate: any = '';
  exportFileString = `api/reports/mv/calls?filter[from]=${this.from}&filter[to]=${this.to}&`;
  totalPages = 0;
  constructor(private userService: UsersService, 
    fb: FormBuilder, private _snackBar: MatSnackBar) {
    
    this.form = fb.group({
      direction: [null],
      form: [null],
      to: [null]
    })

    this.fromDate =  formatDate(new Date(),'YYYY-MM-dd','en');
    this.toDate = formatDate(new Date(),'YYYY-MM-dd','en');
  }

  ngOnInit() {          


    if (sessionStorage.getItem('device') == 'mobile')
          this.width = '20%';    
    this.userService.callsHistoryReport(this.from,this.to).subscribe(data => {
     this.dataSource.data = data.data;
      this.current_page = data.current_page;
      this.paginate = data;
      this.totalPages = data.last_page;
    })

  }
   


  firstPage() {
    this.refreshPage(this.paginate['first_page_url']);
  }

  nextPage() {
    this.refreshPage(this.paginate['next_page_url']);
  }

  prevPage() {
    this.refreshPage(this.paginate['prev_page_url']);
  }

  lastPage() {
    this.refreshPage(this.paginate['last_page_url']);
  }


  refreshPage(url:string) {
    if (this.searchString == '?') url = `${url}&filter[from]=${this.from}&filter[to]=${this.to}` ;
    this.userService.paginate(url).subscribe(data => {    
      this.current_page = data.current_page;
      this.paginate = data;
      this.paginate['first_page_url'] = this.paginate['first_page_url'] + this.searchString.replace('?', '&');
      this.paginate['next_page_url'] = this.paginate['next_page_url'] + this.searchString.replace('?', '&');
      this.paginate['prev_page_url'] = this.paginate['prev_page_url'] + this.searchString.replace('?', '&');
      this.paginate['last_page_url'] = this.paginate['last_page_url'] + this.searchString.replace('?', '&');
      this.totalPages = data.last_page;
    })

  }

  search() {    

    let diffDates = Math.round((new Date(this.toDate).getTime() - new Date(this.fromDate).getTime())/ (1000 * 3600 * 24));
    if (diffDates > 30) {
    this.openSnackBar('حطا','بازه زمانی بیش از 30 روز است') ;
    return;
   }

  this.searchString = '?';
    if (this.form.controls['direction'].value)
      this.searchString = this.searchString + 'filter[direction]=' + this.form.controls['direction'].value;           
    
    if (this.fromDate)
      this.searchString = this.searchString + '&filter[from]=' + formatDate(this.fromDate,'YYYY-MM-DD','en');
      else this.searchString = this.searchString + '&filter[from]=' + this.from;
    if (this.toDate)
      this.searchString = this.searchString + '&filter[to]=' +formatDate(this.toDate,'YYYY-MM-DD','en');
      else
      this.searchString = this.searchString + '&filter[to]=' + this.to;

      this.exportFileString = `api/reports/mv/calls${this.searchString}&`;

    this.userService.searchString(this.searchString).subscribe(data => {
      this.dataSource.data = data.data;
      this.current_page = data.current_page;
      this.paginate = data;
      this.paginate['first_page_url'] = this.paginate['first_page_url'] + this.searchString.replace('?', '&');
      this.paginate['next_page_url'] = this.paginate['next_page_url'] + this.searchString.replace('?', '&');
      this.paginate['prev_page_url'] = this.paginate['prev_page_url'] + this.searchString.replace('?', '&');
      this.paginate['last_page_url'] = this.paginate['last_page_url'] + this.searchString.replace('?', '&');
      this.totalPages = data.last_page;
    });
  }

 
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }


  }





