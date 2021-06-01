import { Component, OnInit, ComponentFactoryResolver, ViewChild, AfterViewInit } from '@angular/core';
import { from, Subscription } from 'rxjs';
import { DeleteConfirmDirective } from '../../../shared/directives/delete-confirm.directive';
import { VerifyModalComponentComponent } from '../../../shared/components/verify-modal-component/verify-modal-component.component';
import { ButtonserviceService } from '../buttonservice.service';
import { ButtonModalComponent } from '../button-modal/button-modal.component';
import { HttpParams } from '@angular/common/http';
import { UsersService } from '../users.service';
import { AppConfigService } from '../../../app-config.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-buttons-list',
  templateUrl: './buttons-list.component.html',
  styleUrls: ['./buttons-list.component.scss']
})
export class ButtonsListComponent implements OnInit,AfterViewInit {
  dataSourceDataHolder:any[] =[];
  data2 = [];
  clear!: Subscription;
  superVisor = false;
  controller!: Subscription;
  verifyModalComponentComponent = VerifyModalComponentComponent;
  buttonModalComponent = ButtonModalComponent;
  @ViewChild(DeleteConfirmDirective, { static: false }) alertHost!: DeleteConfirmDirective;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['row','name', 'color', 'queue_name', 'description','actions'];
  dataSource = new MatTableDataSource<any>();
  panelOpenState = true;

  constructor(private _snackBar: MatSnackBar,
    private componentFactoryResolver: ComponentFactoryResolver,
    private userservice: UsersService,  
    private btnService: ButtonserviceService,) {  
    this.btnListRefresh();

  }

  ngOnInit() {
    this.userservice.allQueues().subscribe(data => {

      this.buttonModalComponent.prototype.queues = data.sort((a:any, b:any) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
    })


  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
  deleteRowConfirm(row:any) {
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
        this.deleteButton(row);
      this.controller.unsubscribe();
      ref.clear();

    });
  }
  deleteButton(data:any) {
    this.btnService.deleteButton(data.id).subscribe(data => {
      this.btnListRefresh();
      this.openSnackBar('حذف آیتم', 'عملیات انجام شد');
    });
  }

  btnListRefresh() {
    this.btnService.showButtons().subscribe(data => {
       this.dataSource.data = data.data;
       this.dataSourceDataHolder = data.data;
    });


  }


  addButton() {
    this.buttonModalComponent.prototype.data = [];
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.buttonModalComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    const component = ref.createComponent(modal);
    this.clear = component.instance.close.subscribe(data => {
      this.clear.unsubscribe();
      ref.clear();
    })

    this.clear = component.instance.buttonData.subscribe(data => {
      const params = new HttpParams().
        set('name', data.data['name'])
        .set('description', data.data['description'])
        .set('queue_name', data.data['queue_name'])
        .set('nature', data.data['nature'])
        .set('color', data.data['color']);
      this.btnService.saveButton(params).subscribe(data => {
        this.openSnackBar('افزودن آیتم', 'عملیات انجام شد')
        this.btnListRefresh();
      });
      this.clear.unsubscribe();
      ref.clear();
    });


  }

  editButton(data:any) {
    this.buttonModalComponent.prototype.data = data;
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.buttonModalComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    const component = ref.createComponent(modal);
    this.clear = component.instance.close.subscribe(data => {
      this.clear.unsubscribe();
      ref.clear();
    })

    this.clear = component.instance.buttonData.subscribe(data => {
      const params = new HttpParams()
        .set('id', data.data['id'])
        .set('name', data.data['name'])
        .set('description', data.data['description'])
        .set('queue_name', data.data['queue_name'])
        .set('nature', data.data['nature'])
        .set('color', data.data['color']);
      this.btnService.updateButton(data.data['id'], params).subscribe(data => {
        this.openSnackBar('ویرایش آیتم', 'عملیات انجام شد');
        this.btnListRefresh();
      })
      this.clear.unsubscribe();
      ref.clear();
    });
  };

  filterList(value:HTMLInputElement){

    if (!value.value){
      this.btnListRefresh();
      return;
    }

    this.dataSource.data = []
  from(this.dataSourceDataHolder).pipe(filter(filters =>
      filters[value.id]  ? filters[value.id].toLowerCase().includes(value.value.toLocaleLowerCase()) : false  
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
