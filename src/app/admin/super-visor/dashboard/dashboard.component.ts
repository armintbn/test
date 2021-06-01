import { ChangeDetectorRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import * as moment from 'jalali-moment';
import { BehaviorSubject, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { AppConfigService } from 'src/app/app-config.service';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  internal = '';
  status:any;
  selectedQueue = '';
  agentsList:any = [];
  allAgents: Array<string> = Array.from({ length: 10 });
  panelOpenState = true;
  agentStatusByWebSocket = webSocket({ url: `` });
  queuesToshow = [];
  queueMembersDetails = new BehaviorSubject<any>([]);
  wait = false;
  dataHolder: any;
  delay: any;
  statusList:any = [];
  constructor(private usersService: UsersService,
    private cdr: ChangeDetectorRef, private ngZone: NgZone,
    private appService: AppConfigService) {
    this.usersService.allQueues().subscribe(data => {
      this.queuesToshow = data;
      this.queuesToshow.sort((a: any, b: any) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));      
      // this.usersService.agentStatusList().subscribe(data =>{
      //   this.statusList = data.data
      // })
      this.statusList = ["--","unknown","not_inuse","inuse","busy","invalid","unavailable","ringing","ringinuse","onhold"];
    })

   

  }

  ngOnInit() {

    this.agentStatusByWebSocket = webSocket({ url: this.appService.baseUrl.replace('http','ws') + this.appService.getServerConfig().backend_ws_port + '/member/status' });    
    this.ngZone.runOutsideAngular(() => {
      this.memberStatusWebsocketInit();      
    })

    this.queueMembersDetails.subscribe(data =>{     
       this.agentsList = data;
       this.liveFilterStatus();
    })

  }


  send_queues_names_to_webSocket(data: string) {
    this.queueMembersDetails.next([]);
    this.selectedQueue = data;
    let filters = this.makeFilter();    
    this.agentStatusByWebSocket.next({'queue':this.selectedQueue ,filter:filters});
    this.wait = true;    
   
  }

  dateFormatter(inputDate: any) {
    if (inputDate == 0) return '----';
    let date = new Date(Number(inputDate) * 1000);
    let hours = String(date.getHours());
    let minute = String(date.getMinutes());
    let second = String(date.getSeconds());
    if (hours.length == 1) hours = '0' + hours;
    if (minute.length == 1) minute = '0' + minute;
    if (second.length == 1) second = '0' + second;
    return hours + ':' + minute + ':' + second
      + '  ' + moment(new Date(date)).format('jYYYY/jM/jD');
  }

  makeFilter(){
    let filters = {};
    if (this.status !='--')
    filters = {status:this.status};
    if (this.delay && this.delay != '--')
    filters = {paused : this.delay}
    if ((this.status && this.status != '--') && (this.delay && this.delay != '--'))
    filters = {status:this.status,paused : this.delay}

    return filters;
  }

  liveFilterStatus() {
    if (this.internal)
      this.filterData();
  }




  timeFormatter(time: any) {
    if (time == 0) return '--';
    let dater = Number(time) * 1000;
    let date = new Date(dater);
    let diffDays = new Date().getTime() - date.getTime();
    let h, m, s;
    h = Math.floor(diffDays / 1000 / 60 / 60);
    m = Math.floor((diffDays / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((diffDays / 1000 / 60 / 60 - h) * 60 - m) * 60);

    s < 10 ? s = `0${s}` : s = `${s}`
    m < 10 ? m = `0${m}` : m = `${m}`
    h < 10 ? h = `0${h}` : h = `${h}`
    return `${h}:${m}:${s}`;

  }

  memberStatusWebsocketInit() {

    this.agentStatusByWebSocket.subscribe(
      (msg: any) => {
        this.wait = false;
        this.queueMembersDetails.next(msg.data);
        this.cdr.detectChanges();
        this.dataHolder = msg.data;
        this.liveFilterStatus();
      }, keepConnectionAlive => {
        setTimeout(() =>{
          this.memberStatusWebsocketInit();
        },5000)       
       
      });
  }

  filterData() {
    this.internalSearch();
  }


  internalSearch() {
    if (!this.internal) {
      this.agentsList = this.dataHolder
      return;
    }

    let dataFinder: any = [];
    this.agentsList = this.dataHolder;


    this.internal ? from(this.agentsList).pipe(filter((filters: any) =>
      this.internal ? filters.name.toLowerCase().includes(this.internal.toLowerCase()) :
        false
    )).subscribe(data => {
      dataFinder.push(data)
    })
      : this.agentsList;
    this.agentsList = dataFinder.length ? dataFinder : [];
  }


  ngOnDestroy() {   
    this.agentStatusByWebSocket.complete();
  }

}



