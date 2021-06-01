import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'ngx-calls-report-admin',
  templateUrl: './calls-report-admin.component.html',
  styleUrls: ['./calls-report-admin.component.scss']
})
export class CallsReportAdminComponent implements OnInit {
  width = '10%';
  form: FormGroup;
  details! : FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['row','name', 'queue', 'direction', 'channel','dstchannel','dst','calldate','bill_time'];
  dataholder = [];
  firstLoad = false;
  searchString = '?';
  today = new Date();
  totalPages = 0;
  lastmonth = new Date(this.today.getTime() - (60*60*1000));
  from =  formatDate(this.lastmonth, 'yyyy-MM-dd', 'en');
  to = formatDate(this.today, 'yyyy-MM-dd', 'en');

  fromHourTime!: number;
  fromMinTime: number | string = '00';
  toHourTime!: number;
  toMinTime: number | string = '00';

  maxLengthHour!: number;
  maxLengthMin: number | string = '00';
  minLengthHour!: number;
  minLengthMin: number | string = '00';
  
  hours:number[] = [];
    minutes: number[] = [];

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    internals: any = [];
    readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  exportFileString = `api/reports/mv/calls/all?filter[from]=${this.lastmonth}&filter[to]=${this.today}&`;
  paginate:any = [];
  current_page = 0;
  fromDate: any = '';
  toDate: any = '';
  panelOpenState = true;
  data = [];
  constructor(private userService: UsersService, fb: FormBuilder, private _snackBar: MatSnackBar,) {

    this.form = fb.group({
      direction: [null],
      members: [[null]],
      form: [null],
      to: [null]
    })
    
    this.fromDate = new Date();
    this.toDate = new Date();
     
  }

  ngOnInit() {
    if (sessionStorage.getItem('device') == 'mobile')
          this.width = '20%';    
    this.userService.callsHistoryReportForSuperVisor(formatDate(new Date(), 'yyyy-MM-dd', 'en'),formatDate(new Date(), 'yyyy-MM-dd', 'en')
    ).subscribe(data => {
      this.dataSource.data = data.data;
      this.current_page = data.current_page;
      this.paginate = data;
      this.totalPages = data.last_page;
    })

         for (let i=0;i<24;++i)
              this.hours.push(i);

          for (let j=0;j<60;j++)
              this.minutes.push(j); 

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
    if (this.searchString == '?')   
    url = `${url}&filter[from]=${formatDate(new Date(), 'yyyy-MM-dd', 'en')}&filter[to]=${formatDate(new Date(), 'yyyy-MM-dd', 'en')}` ;
    this.userService.paginate(url).subscribe(data => {
      this.dataSource.data = data.data;
      this.totalPages = data.last_page;
      this.current_page = data.current_page;
      this.paginate = data;
      this.paginate['first_page_url'] = this.paginate['first_page_url'] + this.searchString.replace('?', '&');
      this.paginate['next_page_url'] = this.paginate['next_page_url'] + this.searchString.replace('?', '&');
      this.paginate['prev_page_url'] = this.paginate['prev_page_url'] + this.searchString.replace('?', '&');
      this.paginate['last_page_url'] = this.paginate['last_page_url'] + this.searchString.replace('?', '&');   
    })

  }

  search() {  
      this.DateValidtor();
      this.searchStringMaker();
      this.userService.searchStringSuperVisor(this.searchString).subscribe(data => {
      this.dataSource.data = data.data;
      this.current_page = data.current_page;
      this.paginate = data;
      this.paginate['first_page_url'] = this.paginate['first_page_url'] + this.searchString.replace('?', '&');
      this.paginate['next_page_url'] = this.paginate['next_page_url'] + this.searchString.replace('?', '&');
      this.paginate['prev_page_url'] = this.paginate['prev_page_url'] + this.searchString.replace('?', '&');
      this.paginate['last_page_url'] = this.paginate['last_page_url'] + this.searchString.replace('?', '&');    
      this.totalPages = data.last_page;
      })
    }


    DateValidtor() {
        let diffDates = Math.round((new Date(this.toDate).getTime() - new Date(this.fromDate).getTime()) / (1000 * 3600 * 24));
        if (diffDates > 30) {
            this.openSnackBar('حطا', 'بازه زمانی بیش از 30 روز است');
            return;
        }
    }

  searchStringMaker(){
     this.searchString = '?';
    if (this.form.controls['direction'].value)
      this.searchString = this.searchString + 'filter[direction]=' + this.form.controls['direction'].value;    
    
    if (this.fromDate)
      this.searchString = this.searchString + '&filter[from]=' + formatDate(this.fromDate, 'yyyy-MM-dd', 'en');
      else this.searchString = this.searchString + '&filter[from]=' + formatDate(this.from, 'yyyy-MM-dd', 'en');
    if (this.toDate)
      this.searchString = this.searchString + '&filter[to]=' + formatDate(this.toDate, 'yyyy-MM-dd', 'en');
      else
      this.searchString = this.searchString + '&filter[to]=' + formatDate(this.to, 'yyyy-MM-dd', 'en');

      if (this.fromHourTime && this.fromMinTime)
          this.searchString = this.searchString + '&filter[start_time]=' + this.fromHourTime + ':' + this.fromMinTime ;
      if (this.toHourTime && this.toMinTime)
          this.searchString = this.searchString + '&filter[end_time]=' + this.toHourTime + ':' + this.toMinTime;

      if (this.internals.length)
        this.searchString = this.searchString + this.internalstringSearchMaker();
    
        if (this.maxLengthHour && this.maxLengthMin)
        this.searchString = this.searchString + '&filter[length_bigger]=' +  this.minLengthHour + ':' + this.minLengthMin;
        if (this.minLengthHour && this.minLengthMin)
        this.searchString = this.searchString + '&filter[length_smaller]=' + this.maxLengthHour + ':' + this.maxLengthMin;
       
     

      this.exportFileString = `api/reports/mv/calls/all${this.searchString}&`;
  }

  resetToDate(){
    if (!this.firstLoad){
    this.toDate = this.toDate;
    this.firstLoad = true;
    }
  }

   parseDate(str:any) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

  datediff(first:any, second:any) {    
    return Math.round((second-first)/(1000*60*60*24));
  }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.internals.push({ 'filter[members][]': value });
        }

        event.input.value = '';
    }

    remove(internal: string): void {
        const index = this.internals.indexOf(internal);

        if (index >= 0) {
            this.internals.splice(index, 1);
        }
    }

    internalstringSearchMaker() {
        let string:string = '';
        this.internals.forEach((item:any) => {
            string = string + '&' + 'filter[members][]=' + item['filter[members][]']
        })
        return string.split(' ').join('');
    }

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 5000,
  });
}

}

