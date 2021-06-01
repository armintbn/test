import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WallboardService {
  private baseUrl = '';
  constructor(private http: HttpClient , private appService: AppConfigService) {
    this.baseUrl = this.appService.baseUrl + this.appService.getServerConfig().backend_http_port;
   }

  
  public allQueues():Observable<any>{
    const url = `${this.baseUrl}/api/queues`;
    return this.http.get(url);
  } 

  public moreQueuesAdded():Observable<any>{
    const url = `${this.baseUrl}/api/reporter/queue`;
    return this.http.get(url);
  }  

  public createSettings(name:any,settings:any):Observable<any>{
  const url = `${this.baseUrl}/api/preferences`;
  return this.http.post(url,{name:name,options:settings});
  }

  public getSettings(name:any):Observable<any>{
    const url = `${this.baseUrl}/api/preferences?names[]=${name}`;   
    return this.http.get(url)        
    }

    public updateSettings(options:any,id:any):Observable<any>{
      const url = `${this.baseUrl}/api/preferences/${id}`;
      return this.http.patch(url,{options:options});

      }




}
