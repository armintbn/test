import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './login.model';
import { AppConfigService } from '../app-config.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  // tslint:disable-next-line:max-line-length
  baseUrl:any;
  constructor(private http: HttpClient, private appService: AppConfigService) {    
    this.baseUrl = this.appService.baseUrl + this.appService.getServerConfig().backend_http_port; 
   }
   
  headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  public register(user: User) {
    const url = this.baseUrl + '/api/register';
    return this.http.post(url, user);
  }

  public login(login: any) {
    const url = this.baseUrl + '/oauth/token';
    return this.http.post(url, login, { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') });
  }

  public logout(): Observable<any> {
    const url = this.baseUrl + '/api/logout';     
    return this.http.post(url, {});
  }

  public user(): Observable<any> {
    const url = this.baseUrl + '/api/user';
    return this.http.get(url);
  }

  public userprofile():Observable<any>{
    const url = `${this.baseUrl}/api/profile`;
    return this.http.get(url);
  }


}
