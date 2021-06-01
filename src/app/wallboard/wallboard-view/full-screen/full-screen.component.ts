import { AfterViewInit, Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'ngx-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.scss']
})
export class FullScreenComponent implements AfterViewInit,OnDestroy {

  allowedList:any ;
  Queue:any;
  Queue2:any;
  selector:any;
  wallBoardSettings:any;
  @Output() close = new EventEmitter<void>();

  constructor() {
    document.body.style.overflow = 'hidden';
   }


   ngAfterViewInit(){
     if (!this.wallBoardSettings)
         this.wallBoardSettings = {};
   }

  return(){
    this.close.emit();
  }




  visibilitySettingsParser(queue:any,key:any){
    if (this.wallBoardSettings.length) 
    for (let i=0;i<this.wallBoardSettings.length;++i){
         if (this.wallBoardSettings[i].queuename == queue 
           && this.wallBoardSettings[i].settingData[key] ) 
           return this.wallBoardSettings[i].settingData[key].visibility;
    } 
    else    
    return true;

    if (this.wallBoardSettings.findIndex((finder:any) => finder.queuename == queue) == -1 )
    return true;
 
   }
 
   colorsSettingsParser(queue:any, key:any, value:any):any {     
    let color = '';
    if (this.wallBoardSettings.length)
      for (let i = 0; i < this.wallBoardSettings.length; ++i) {
        if (this.wallBoardSettings[i].queuename == queue
          && this.wallBoardSettings[i].settingData[key]) {

          if ((this.wallBoardSettings[i].settingData[key].value1 && value >= this.wallBoardSettings[i].settingData[key].value1) == 0)
            color = this.wallBoardSettings[i].settingData[key].color1;  
            
          if (this.wallBoardSettings[i].settingData[key].value2 && value >= this.wallBoardSettings[i].settingData[key].value2)
            color = this.wallBoardSettings[i].settingData[key].color2;
            

          if (this.wallBoardSettings[i].settingData[key].value3 && value >= this.wallBoardSettings[i].settingData[key].value3)
            color = this.wallBoardSettings[i].settingData[key].color3;
           
          return color;
        }

      }

  }



  ngOnDestroy(){
    document.body.style.overflow = 'auto'; 
  }

}
