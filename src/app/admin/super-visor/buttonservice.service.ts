import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonserviceService {
  // tslint:disable-next-line:max-line-length
  baseUrl = '';
  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.baseUrl = this.appConfig.baseUrl + this.appConfig.getServerConfig().backend_http_port;
  }

  public showButtons(queue?: any): Observable<any> {
    let url = '';
    if (queue)
      url = this.baseUrl + `/api/buttons?filter[queue_name]=${queue}`;
    else
      url = this.baseUrl + `/api/buttons`;
    return this.http.get(url);
  }



  public saveButton(data: any): Observable<any> {
    const url = this.baseUrl + '/api/buttons';
    return this.http.post(url, data);
  }

  public updateButton(id: any, data: any): Observable<any> {
    const url = this.baseUrl + `/api/buttons/${id}`;
    return this.http.patch(url, data);
  }

  public deleteButton(id: any): Observable<any> {
    const url = this.baseUrl + `/api/buttons/${id}`;
    return this.http.delete(url);
  }

  public showAgentButtons(): Observable<any> {
    const url = this.baseUrl + '/api/users/buttons';
    return this.http.get(url);
  }

  public superVisorButtons(): Observable<any> {
    const url = `${this.baseUrl}/api/users/buttons`;
    return this.http.get(url);
  }

  public buttonsReport(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/reports/buttons/${id}/agents`;
    return this.http.get(url);

  }



  public agentsinButton(id: any): Observable<any> {
    let url = `${this.baseUrl}/api/reports/buttons/${id}/agents`;
    return this.http.get(url);
  }

  public agentsinButtonForFinish(queue: any, status: any): Observable<any> {
    let url = `${this.baseUrl}/api/reports/agents?queue=${queue}&status=${status}`;
    return this.http.get(url);
  }


}
