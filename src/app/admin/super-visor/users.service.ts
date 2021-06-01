import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../app-config.service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // tslint:disable-next-line:max-line-length
  private baseUrl = '';
  constructor(private http: HttpClient, private appService: AppConfigService) {
    this.baseUrl = this.appService.baseUrl + this.appService.getServerConfig().backend_http_port;
  }

  public showUsers(): Observable<any> {
    const url = this.baseUrl + '/api/users';
    return this.http.get(url);
  }

  public agentStatusList(): Observable<any> {
    const url = `${this.appService.baseUrl + this.appService.getServerConfig().backend_ws_port}/member/statuses`;
    return this.http.get(url);
  }

  public findUser(id: number): Observable<any> {
    const url = this.baseUrl + `/api/users/${id}`;
    return this.http.get(url);
  }

  public saveUser(data: any): Observable<any> {
    const url = this.baseUrl + '/api/users';
    return this.http.post(url, data);
  }

  public editUser(id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}/api/users/${id}`;
    return this.http.patch(url, data);
  }
  public deleteUser(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/users/${id}`;
    return this.http.delete(url);
  }


  public allQueues(): Observable<any> {
    const url = `${this.baseUrl}/api/queues`;
    return this.http.get(url);
  }

  public queuesWithMembers(): Observable<any> {
    const url = `${this.baseUrl}/api/queue-members`;
    return this.http.get(url);
  }

  public moreQueuesAdded(): Observable<any> {
    const url = `${this.baseUrl}/api/reporter/queue`;
    return this.http.get(url);
  }

  public usersHistory(): Observable<any> {
    const url = `${this.baseUrl}/api/activities`;
    return this.http.get(url);
  }

  public userHistory(id: number): Observable<any> {
    const url = `${this.baseUrl}/api/activities?filter[user_id]=${id}`;
    return this.http.get(url);
  }

  public userHistoryForAgentPannel(): Observable<any> {
    let toDay = formatDate(new Date(), 'YYYY-MM-dd', 'en');
    const url = `${this.baseUrl}/api/activities/summary/current-user/?date=${toDay}`;
    return this.http.get(url);
  }

  public callsHistoryReport(from: any, to: any): Observable<any> {
    const url = `${this.baseUrl}/api/reports/mv/calls?filter[from]=${from}&filter[to]=${to}`;
    return this.http.get(url);
  }

  public callsHistoryReportForSuperVisor(from: any, to: any): Observable<any> {
    const url = `${this.baseUrl}/api/reports/mv/calls/all?filter[from]=${from}&filter[to]=${to}`;
    return this.http.get(url);
  }

  public userprofile(): Observable<any> {
    const url = `${this.baseUrl}/api/profile`;
    return this.http.get(url);
  }

  public paginate(url: string): Observable<any> {
    return this.http.get(url);
  }

  public paginate2(url: string): Observable<any> {
    return this.http.get(`url/api/reports/mv/calls${url}`);
  }

  public searchString(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/reports/mv/calls${url}`);
  }

    public searchStringSuperVisor(url: string): Observable<any> {
        url = this.UrlsearchStringChecker(url);
        return this.http.get(`${this.baseUrl}/api/reports/mv/calls/all${url}`);
  }

  public userActivitiesHistory(pageNumber: number, searchString: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/activities?page=${pageNumber}${searchString}`);
  }

  public userActivitySearch(id: number, url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/activities?page=${url}filter[user_id]=${id}`);
  }

  public userActivitySearchForSuperVisor(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/activities?${url}`);
  }

  public MakeReportFile(type: string, url: string): Observable<any> {
    let headers = new HttpHeaders();
      headers = headers.set('Accept', `application/${type}`);
      url = this.UrlsearchStringChecker(url);
      return this.http.get(`${this.baseUrl}/${url}export=${type}`,
      { responseType: 'blob' });
  }

      private UrlsearchStringChecker(url: string) {
        url = url.replace('?&', '?');
        url = url.replace('&&', '?');
        return url;
    }




}
