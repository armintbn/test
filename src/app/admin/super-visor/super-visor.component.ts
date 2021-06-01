import {
  Component, OnInit, 
  ComponentFactoryResolver, ViewChild, AfterViewInit, Inject,
} from '@angular/core';
import { DeleteConfirmDirective } from '../../shared/directives/delete-confirm.directive';
import { from, Subscription } from 'rxjs';
import { VerifyModalComponentComponent } from '../../shared/components/verify-modal-component/verify-modal-component.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { UsersService } from './users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersModalComponent } from 'src/app/shared/components/users-modal/users-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'ngx-super-visor',
  templateUrl: './super-visor.component.html',
  styleUrls: ['./super-visor.component.scss']
})
export class SuperVisorComponent implements OnInit,AfterViewInit {
  @ViewChild(DeleteConfirmDirective, { static: false }) alertHost!: DeleteConfirmDirective ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['row','first_name', 'last_name', 'members', 'mobile','email','queues','actions'];
  dataSource = new MatTableDataSource<any>();
  usersModalComponent = UsersModalComponent;

  verifyModalComponentComponent = VerifyModalComponentComponent;
  clear!: Subscription;
  controller!: Subscription;
  Queue = [];
  data = [];
  counter = [];
  selector = [];
  allowedList = [];
  superVisor = false;
  panelOpenState = true;
  options: any = {};
  themeSubscription: any;
  dataSourceDataHolder:any[]=[];
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private _snackBar: MatSnackBar,
    private userservice: UsersService,    
  ) {}


  ngOnInit() {
    this.userservice.allQueues().subscribe(data => {

      this.usersModalComponent.prototype.queues = data.sort();
    })

    this.usersRefresh();

  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  selectors(data:any) {
    this.allowedList = data;
  }

  addUser(data?: any) {
   if (data){   
   this.usersModalComponent.prototype.title = 'ویرایش کاربر';       
   this.userservice.findUser(data.id).subscribe(data =>{
     this.usersModalComponent.prototype.data = data.data;      
     });
    }
      else {
      this.usersModalComponent.prototype.data = '';
      this.usersModalComponent.prototype.title = 'افزودن کاربر';
      }

   
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.usersModalComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    const component:any = ref.createComponent(modal);
    this.clear = component.instance.close.subscribe((data:any) => {
      this.clear.unsubscribe();
      ref.clear();
    })



    this.clear = component.instance.userData.subscribe((user:any) => {
      if (user.data.id) {
        let id = user.data.id;  
        
        delete(user.data.id);
        this.userservice.editUser(id, user.data).subscribe(data => {
          this.usersRefresh();
         this.openSnackBar('ویرایش کاربر ', 'عملیات انجام شد ');
       });

      }
      else {
        delete(user.data.id);
        delete(user.data.email2);
        delete(user.data.technology2);
        delete(user.data.password2);
        delete(user.data.password_confirmation2);
        delete(user.data.queues2);
        delete(user.data.technology);

        this.userservice.saveUser(user.data).subscribe((data:any) => {
          this.usersRefresh();
          this.openSnackBar('افزودن کاربر ', 'عملیات انجام شد ');
        }, (error:HttpErrorResponse) => {
          this.openSnackBar(String(error.status), error.message);
        });
      }

      this.clear.unsubscribe();
      ref.clear();
    });
  
  }

  userDeleteConfirm(row:any) {
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.verifyModalComponentComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    let component = ref.createComponent(modal);

    this.controller = component.instance.exit.subscribe((data:any) => {
      this.controller.unsubscribe();
      ref.clear();

    });

    this.controller = component.instance.confirm.subscribe((data:any) => {
      if (data.response)
        this.deleteUser(row);
      this.controller.unsubscribe();
      ref.clear();

    });

  }

 

  queueNamesFinder(queue:any) {
    let names = '';
    for (let i = 0; i < queue.length; ++i)
      names = names + ' ' + queue[i].name;
    return names;
  }

  onSearch(query: string = '') {
   

  }
  

  deleteUser(data:any) {
    this.userservice.deleteUser(data.id).subscribe((data:any) => {
      this.usersRefresh();
       this.openSnackBar('حذف کاربر ', 'عملیات انجام شد');
    })
  }

  usersRefresh() {
    this.userservice.showUsers().subscribe((data:any) => {   
          this.dataSource.data = data.data;
          this.dataSourceDataHolder = data.data;
         this.dataSource._updateChangeSubscription();                  
    });
  }


filterList(value:HTMLInputElement){
  if (!value.value){
    this.usersRefresh();
    return;
  }
  this.dataSource.data = [];
  from(this.dataSourceDataHolder).pipe(filter(filters =>
    filters[value.id]  ? filters[value.id].toLowerCase().includes(value.value.toLowerCase()) : false  
    )).subscribe(data =>{     
      this.dataSource.data.push(data);      
      this.dataSource._updateChangeSubscription();
    })  
}


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}



