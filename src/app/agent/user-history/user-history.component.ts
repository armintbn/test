import { formatDate } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/admin/super-visor/users.service';
@Component({
  selector: 'ngx-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements AfterViewInit {

  displayedColumns: string[] = ['row', 'queue_name', 'activity', 'started_at','ended_at','length'];
  dataSource = new MatTableDataSource<any>();
  width = '10%';
  userId:any;
  panelOpenState = true;
  searchString = '?';
  dataholder = [];
  paginate:any = [];
  fromDate: any = '';
  toDate: any = '';
  exportFileString = `api/activities`;
  current_page = 0;
  totalPages = 0;   
  constructor(private userservice: UsersService, private _snackBar: MatSnackBar) {
    this.userservice.userprofile().subscribe(user =>{   
    this.userId = user.data.id;
    this.exportFileString = `api/activities?filter[user_id]=${this.userId}&`;
    this.userservice.userHistory(user.data.id).subscribe(data => {     
      this.dataSource.data = [];     
      this.dataSource.data = data.data;
          this.current_page = data.meta.current_page;
          this.paginate = data.links;  
          this.totalPages =  data.meta.last_page;
    });
  });
}
    
  
ngAfterViewInit(){
  if (sessionStorage.getItem('device') == 'mobile')
        this.width = '20%';
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
    this.searchString = '';
    if (this.fromDate) 
      this.searchString = this.searchString + '&filter[start_date]=' + formatDate(this.fromDate,'YYYY-MM-dd','en');

    
    if (this.toDate)
      this.searchString = this.searchString + '&filter[end_date]=' + formatDate(this.toDate,'YYYY-MM-dd','en');

      this.exportFileString = `api/activities?${this.searchString}&filter[user_id]=${this.userId}&`;  
      this.userservice.userActivitySearch(this.userId,this.searchString + '&').subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data.data;
      this.dataSource._updateChangeSubscription();
          this.current_page = data.meta.current_page;
          this.paginate = data.links;             
          this.paginate['first'] = this.paginate['first'] + this.searchString;
          this.paginate['next'] = this.paginate['next'] + this.searchString;
          this.paginate['prev'] = this.paginate['prev'] + this.searchString;
          this.paginate['last'] = this.paginate['last'] + this.searchString;
          this.totalPages =  data.meta.last_page;                   
    })
  
  }

  refreshPage(url:string) {    
    if (this.searchString == '?') this.searchString = '';
    this.userservice.paginate(`${url}${this.searchString}&filter[user_id]=${this.userId}`).subscribe(data => {    
      this.current_page = data.meta.current_page;
      this.paginate = data.links;
      this.dataSource.data = data.data;
      this.dataSource._updateChangeSubscription();
      this.paginate['first'] = this.paginate['first'] + this.searchString;
      this.paginate['next'] = this.paginate['next'] + this.searchString;
      this.paginate['prev'] = this.paginate['prev'] + this.searchString;
      this.paginate['last'] = this.paginate['last'] + this.searchString ;
      this.totalPages =  data.meta.last_page;  
    })
  

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
