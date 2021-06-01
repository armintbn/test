import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {  

  ngAfterViewInit(){     
    if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone') 
    || navigator.userAgent.includes('iPad') ) {
      sessionStorage.setItem('device','mobile');
      }
      else {
      sessionStorage.setItem('device','pc');
      }
  }

}
