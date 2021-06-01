import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ComponentFactoryResolver, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { LoginServiceService } from 'src/app/auth/login-service.service';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../../app-config.service';
import { DeleteConfirmDirective } from '../../shared/directives/delete-confirm.directive';
import { WallboardService } from '../wallboard.service';
import { FullScreenComponent } from './full-screen/full-screen.component';
import { WallboardSettingsComponent } from './wallboard-settings/wallboard-settings.component';

@Component({
  selector: 'ngx-wallboard-view',
  templateUrl: './wallboard-view.component.html',
  styleUrls: ['./wallboard-view.component.scss']
})
export class WallboardViewComponent implements AfterViewInit, OnDestroy {
  wallBoardSettings:any = [];
  allowedList = [];
  webSocket:any = webSocket({ url: `` });
  Queue: any[] = [];
  Queue2: any = [];

  selector = [];
  Alog: any;
  id:any;
  clear!: Subscription;
   superVisor = false;
  fullScreenComponent = FullScreenComponent;
  wallboardSettingsComponent = WallboardSettingsComponent;
  @ViewChild(DeleteConfirmDirective, { static: false }) alertHost!: DeleteConfirmDirective;
  constructor(private appService: AppConfigService,private _snackBar: MatSnackBar,
    private ngZone: NgZone, private wallService: WallboardService, 
    private componentFactoryResolver: ComponentFactoryResolver  ) {     
      
    this.wallService.allQueues().subscribe(data => {
      this.selector = data;
      this.fullScreenComponent.prototype.selector = data;
      this.selector.sort((a:any, b:any) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
      this.refreshSettings();
      this.moreQueueDetails();
    }, (error:HttpErrorResponse) => {
      if (error.status > 500 || !error.status)
        this.showToast('خطا', 'مشکل در برقراری ارتباط با سرور');    
    })

    this.webSocket = webSocket({url : this.appService.baseUrl.replace('http','ws') + this.appService.getServerConfig().backend_ws_port + '/queue/status'});
  }

  ngAfterViewInit() {

    let timer = 0;
    this.ngZone.runOutsideAngular(() =>
      this.Alog = setInterval(() => {
        ++timer;
        if (timer == 60) {
          this.ngZone.run(() =>
            this.moreQueueDetails()

          )

          timer = 0;
        }
      }, 1000))
  }

  selectors(data:any) {
    this.allowedList = data.value;
    if (!this.allowedList.length)
      this.webSocket.complete();
    this.fullScreenComponent.prototype.allowedList = this.allowedList;
  }


  liveStreamConnect() {    
   if (!this.webSocket) {
      this.webSocket = webSocket({ url: `` });
      this.webSocket = webSocket({ url: this.appService.baseUrl.replace('http','ws') + this.appService.getServerConfig().backend_ws_port + '/queue/status'   });
    }
    
    this.websocketDataSendForqueues();
    
      this.webSocket.subscribe(        
        (msg:any) => {    
          setTimeout(() =>{
          if (msg['data'])
          this.Queue = [...msg['data']];  
          this.concatLists();                 
          this.queuesKeys();                  
          this.fullScreenComponent.prototype.Queue = this.Queue;   
          this.fullScreenComponent.prototype.wallBoardSettings = this.wallBoardSettings;         
        },300)
      
      })


  }


  websocketDataSendForqueues() { 
      this.webSocket.next({ 'queues': this.allowedList });
  }

   moreQueueDetails() {
    this.wallService.moreQueuesAdded().subscribe(data => {
      this.Queue2 = [];
      this.Queue2 = [... this.dataFixer(data)];
      this.fullScreenComponent.prototype.Queue2 = this.Queue2;

    }, (error:HttpErrorResponse) => {
      if (error.status > 500 || !error.status)
        this.showToast('خطا', 'مشکل در برقراری ارتباط با سرور');
    
    });
  }


  fullScreen() {
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.fullScreenComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    const component = ref.createComponent(modal);
    this.clear = component.instance.close.subscribe(data => {
      this.clear.unsubscribe();
      ref.clear();
    })
  }

  concatLists(){

   for (let i=0;i<this.Queue.length;++i)
  if (this.Queue2.findIndex((queue:any) => queue.queuename == this.Queue[i]['Queue']) > -1) {
  this.Queue[i] = {... this.Queue[i],... this.Queue2[this.Queue2.findIndex((queue:any) => queue.queuename == this.Queue[i]['Queue'])]}
  delete(this.Queue[i]['queuename']);  
  }
  }



  dataFixer(data:any) {


    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < Object.keys(data[i]).length; ++j)
        if (Number.parseFloat(data[i][Object.keys(data[i])[j]]))
          data[i][Object.keys(data[i])[j]] = Number.parseFloat(data[i][Object.keys(data[i])[j]]).toFixed(2);
         
    }
 
    return data;
  }

  queuesKeys() {
    let keys = [];
    for (let i = 0; i < this.Queue.length; ++i)
      keys.push(Object.keys(this.Queue[i]));
    this.wallboardSettingsComponent.prototype.settingKeys = keys;
  }

  queueSettings(queue:any) {
   
    const modal = this.componentFactoryResolver.resolveComponentFactory(this.wallboardSettingsComponent);
    const ref = this.alertHost.viewContainerRef;
    ref.clear();
    const component = ref.createComponent(modal);
    component.instance.queueName = queue;    
    component.instance.wallboardSettins = this.wallBoardSettings;
    component.instance.keysCombine = this.Queue;
    this.clear = component.instance.close.subscribe(data => {
      this.clear.unsubscribe();
      ref.clear();
    })

    this.clear = component.instance.settingData.subscribe(data => {   
      this.wallBoardSettingsUpdate(data);
      this.fullScreenComponent.prototype.wallBoardSettings = this.wallBoardSettings;    
      ref.clear();
    })

  }



  saveNewSettings(data:any){
    this.wallService.createSettings('wallboard15',data).subscribe((data:any) => {
      this.refreshSettings();
    }, (error:HttpErrorResponse) => {
      if (error.status > 500 || !error.status)
        this.showToast('خطا', 'مشکل در برقراری ارتباط با سرور');
      else
        this.showToast('خطا', 'مشکل در انجام عملیات')
    }); 
  }

  updateSettings(data:any){

    this.wallService.updateSettings(data,this.id).subscribe(data =>{
      this.refreshSettings();
    }, (error:HttpErrorResponse) => {
      if (error.status > 500 || !error.status)
        this.showToast('خطا', 'مشکل در برقراری ارتباط با سرور');
    

    })

  }


  visibilitySettingsParser(queue:any,key:any){
    if (this.wallBoardSettings.length) 
    for (let i=0;i<this.wallBoardSettings.length;++i){    
      if (!this.wallBoardSettings[i])
          return true;
         if (this.wallBoardSettings[i]['queuename'] == queue 
           && this.wallBoardSettings[i]['settingData'][key] ) 
           return this.wallBoardSettings[i]['settingData'][key]['visibility'];
    } 
    else    
    return true;

    if (this.wallBoardSettings.findIndex((finder:any) => finder['queuename'] == queue) == -1 )
    return true;
 
   }

   colorsSettingsParser(queue:any, key:any, value:any):any {     
    let color = '';
    if (this.wallBoardSettings.length)
      for (let i = 0; i < this.wallBoardSettings.length; ++i) {
        if (this.wallBoardSettings[i].queuename == queue
          && this.wallBoardSettings[i].settingData[key]) {

          if ((this.wallBoardSettings[i].settingData[key].value1 && value >= this.wallBoardSettings[i].settingData[key].value1) == 0)
            color = this.wallBoardSettings[i].settingData[key].color1;  
            
          if (this.wallBoardSettings[i].settingData[key].value2 && value >= this.wallBoardSettings[i].settingData[key].value2)
            color = this.wallBoardSettings[i].settingData[key].color2;
            

          if (this.wallBoardSettings[i].settingData[key].value3 && value >= this.wallBoardSettings[i].settingData[key].value3)
            color = this.wallBoardSettings[i].settingData[key].color3;
           
          return color;
        }

      }

  }


  wallBoardSettingsUpdate(data:any) {   
  
    if (this.wallBoardSettings.findIndex((indexer:any) => indexer['queuename'] == data.queuename) > -1)       
        this.wallBoardSettings[this.wallBoardSettings.findIndex((finder:any) => finder['queuename'] == data.queuename)].settingData = data.settingData;                
        else
        this.wallBoardSettings.push(data);
        if (this.id)  
        this.updateSettings(this.wallBoardSettings);
        else
        this.saveNewSettings(this.wallBoardSettings);
                   
  }

  refreshSettings(){
    this.wallService.getSettings('wallboard15').subscribe(data => {
      if (data.data.length ) {
      this.wallBoardSettings = data.data[0].options;        
      this.id = data.data[0].id; 
      }
  
      this.fullScreenComponent.prototype.wallBoardSettings = this.wallBoardSettings;      

      this.fullScreenComponent.prototype.wallBoardSettings = {}; 

      
    }, (error:HttpErrorResponse) => {
      if (error.status > 500 || !error.status)
        this.showToast('خطا', 'مشکل در برقراری ارتباط با سرور');
    

    })
  }

  ngOnDestroy() {
    if (this.webSocket)
      this.webSocket.complete();
      clearInterval(this.Alog);
  }

  showToast(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}


