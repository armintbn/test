import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  baseUrl = (String(document.location.host).includes('localhost:4200') || String(document.location.host).includes('localhost:8080') ? 'http://dev.mahannet.net' : ('http://' + document.location.hostname)) + ':';
  private appConfig: any;
  private serverConfig: any;
  constructor(private http: HttpClient) {  }

  public loadAppConfig() {
    return this.http.get('/assets/appConfig.json').toPromise().then(data => {
      this.appConfig = data;

    })
  }

  public loadServerConfig() {

    return this.http.get('/assets/serverConfig.json').toPromise().then(data => {
      this.serverConfig = data;
      this.loadAppConfig();
    })

  }


  public getConfig() {
    return this.appConfig;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

 

}