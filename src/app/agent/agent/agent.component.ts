import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { AppConfigService } from 'src/app/app-config.service';
import { LoginServiceService } from 'src/app/auth/login-service.service';
import { environment } from 'src/environments/environment';
import { AgentsService } from '../agents/agents.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit,OnDestroy { 
  ringNoAnswerWebSocket:any;
  constructor(private cdr: ChangeDetectorRef, public service: AgentsService,
    private router:Router,private ngZone:NgZone,
    private appService: AppConfigService) { 
      
      if (sessionStorage.getItem('role') == 'supervisor')
       this.router.navigateByUrl('supervisor/dashboard');

  }


 

  ngOnInit(): void {
  
    this.liveData();   
    this.cdr.detectChanges();
    
}

liveData(){ 
  if (!this.ringNoAnswerWebSocket && sessionStorage.getItem('role') == 'agent' 
   ) {
  this.ringNoAnswerWebSocket = webSocket({url:`${this.appService.baseUrl.replace('http','ws') +  this.appService.getServerConfig().backend_ws_port + '/ring-no-answer?user_id=' }` + sessionStorage.getItem('userid') });     
  this.ringNoAnswerWebSocket.subscribe((data:any) =>{
    
    if (data['type'] != 'keep-alive'){               
        this.service.agentStatus = 'ringNoAnswer';        
        this.service.internal = data.member;
        this.service.queue = data.queue;
        this.ringNoAnswerPlan();                
        this.cdr.detectChanges();
    } 
  },(error:HttpErrorResponse) =>{
    setTimeout(() =>{
      this.ringNoAnswerWebSocket = false; 
      this.liveData();
    },3000)    
    
  }) 
}
}

ringNoAnswerPlan(){
  if(!document.URL.includes('dashboard')) {
  this.ngZone.run(() =>{
    this.router.navigate(['/agent/dashboard']);
  })  
  
  this.cdr.detectChanges(); 
  }
  else {
    this.ngZone.run(() =>{
    this.router.navigate(['/supervisor/dashboard']);
    })
    
  }
                                                   
}


ngOnDestroy(){
if (this.ringNoAnswerWebSocket)    
  this.ringNoAnswerWebSocket.complete();
}


}


























// implements OnInit {

//   constructor(private route: Router) {
//       if (sessionStorage.getItem('role') == 'supervisor')
//       this.route.navigateByUrl('supervisor/dashboard');
//    }

//   ngOnInit(): void {
//   }

// }
