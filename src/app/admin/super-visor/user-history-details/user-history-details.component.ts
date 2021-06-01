import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';



@Component({
  selector: 'ngx-user-history-details',
  templateUrl: './user-history-details.component.html',
  styleUrls: ['./user-history-details.component.scss']
})
export class UserHistoryDetailsComponent  {
  width = '10%';
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['row','name', 'queue_name', 'activity', 'started_at','ended_at','length'];
  searchString = '?';
  exportFileString = `api/activities?`;
  dataholder = [];
  paginate:any = [];
  current_page = 0;  
  data = [];
  fromDate: any = '';
  toDate: any = '';
  fromHourTime!: number;
  fromMinTime: number | string = '00';
  toHourTime!: number;
  toMinTime: number | string = '00';
  totalPages = 0;
  panelOpenState = true;
  hours:number[] = [];
  minutes: number[] = [];
  queuesToshow: string[] = [];
  selectedQueue: string = '';
  maxLengthHour!: number;
  maxLengthMin: number | string = '00';
  minLengthHour!: number;
  minLengthMin: number | string = '00';

  constructor(private userservice: UsersService, private _snackBar: MatSnackBar) {
    this.fromDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.toDate =  formatDate(new Date(), 'yyyy-MM-dd', 'en');    
    this.search();
    
  }

  ngAfterViewInit(){
    if (sessionStorage.getItem('device') == 'mobile')
          this.width = '20%';

          for (let i=0;i<24;++i)
              this.hours.push(i);

          for (let j=0;j<60;j++)
      this.minutes.push(j);
    
      this.userservice.allQueues().subscribe(data => {
        this.queuesToshow = data;
        this.queuesToshow.sort((a: any, b: any) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));      
      })
  }
  


  firstPage() {
    this.refreshPage(this.paginate['first']);
  }

  nextPage() {
   
      this.refreshPage(this.paginate['next']);
  }

  prevPage() {
    
      this.refreshPage(this.paginate['prev']);
  }

  lastPage() {
    this.refreshPage(this.paginate['last']);
  }

  search() {
  this.searchStringmaker();
    this.userservice.userActivitySearchForSuperVisor(this.searchString).subscribe(data => {
      this.dataSource.data = [];    
      this.dataSource.data = data.data;
          this.current_page = data.meta.current_page;
          this.paginate = data.links;             
          this.paginate['first'] = this.paginate['first'] + this.searchString;
          this.paginate['next'] = this.paginate['next'] + this.searchString;
          this.paginate['prev'] = this.paginate['prev'] + this.searchString;
          this.paginate['last'] = this.paginate['last'] + this.searchString         
          this.totalPages = data.meta.last_page;         
    })

  }

  searchStringmaker(){
      this.searchString = '';
      if (this.fromDate)
      this.searchString = this.searchString + '&filter[start_date]=' +  formatDate(this.fromDate, 'yyyy-MM-dd', 'en');
      if (this.toDate)
      this.searchString = this.searchString + '&filter[end_date]=' +  formatDate(this.toDate, 'yyyy-MM-dd', 'en');
      if (this.fromHourTime && this.fromMinTime)
      this.searchString = this.searchString + '&filter[start_time]=' + this.fromHourTime + ':' + this.fromMinTime ;
      if (this.toHourTime && this.toMinTime)
      this.searchString = this.searchString + '&filter[end_time]=' + this.toHourTime + ':' + this.toMinTime;
      if (this.selectedQueue)
      this.searchString = this.searchString + '&filter[queue_name]=' + this.selectedQueue;
      if (this.maxLengthHour && this.maxLengthMin)
      this.searchString = this.searchString + '&filter[length_bigger]=' +  this.minLengthHour + ':' + this.minLengthMin;
      if (this.minLengthHour && this.minLengthMin)
      this.searchString = this.searchString + '&filter[length_smaller]=' + this.maxLengthHour + ':' + this.maxLengthMin;
     


    if (this.searchString)
    this.exportFileString = `api/activities?${this.searchString.substring(1)}&` ;  
    else
    this.exportFileString = `api/activities?`;
  }

  refreshPage(url:string) {
    if (this.searchString == '?') this.searchString = '';
    this.userservice.paginate(url).subscribe(data => {
       this.dataSource.data = [];
       this.dataSource.data = data.data;   
      this.current_page = data.meta.current_page;
      this.paginate = data.links;   
      this.paginate['first'] = this.paginate['first'] + this.searchString;
      this.paginate['next'] = this.paginate['next'] + this.searchString;
      this.paginate['prev'] = this.paginate['prev'] + this.searchString;
      this.paginate['last'] = this.paginate['last'] + this.searchString;
      this.totalPages = data.meta.last_page;     
    })

  }

   


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
