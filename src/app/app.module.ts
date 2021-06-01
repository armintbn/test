import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './app-config.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


export function initConfig(configService: AppConfigService) {
  return () => 
    configService.loadServerConfig(); 
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [   
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule

  ],
 
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initConfig,
    deps: [AppConfigService],
    multi: true,
  },
  { provide: LocationStrategy, useClass: HashLocationStrategy }, 
  { provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService, multi: true },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
