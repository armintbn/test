import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { environment } from 'src/environments/environment';
import { LoginServiceService } from 'src/app/auth/login-service.service';



@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  private baseUrl = '';
  public  agentStatus = 'normal';
  public internal = '';

  public queue = '';
  constructor(private http: HttpClient , private appConfig: AppConfigService) {
    this.baseUrl = this.appConfig.baseUrl + this.appConfig.getServerConfig().backend_http_port;  
  }

   public userButtons():Observable<any>{
     const url = `${this.baseUrl}/api/users/buttons`;
     return this.http.get(url);
   }

   public buttonAction(id:any):Observable<any>{
     const url = `${this.baseUrl}/api/activities`;
     return this.http.post(url , id);
   }

   public lastStatus():Observable<any>{
    const url = `${this.baseUrl}/api/users/buttons/last-clicked`;
    return this.http.get(url);
  }
}
