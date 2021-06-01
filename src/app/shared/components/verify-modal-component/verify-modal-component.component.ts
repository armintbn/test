import { Component, ViewContainerRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
@Component({
  selector: 'ngx-verify-modal-component',
  templateUrl: './verify-modal-component.component.html',
  styleUrls: ['./verify-modal-component.component.scss']
})
export class VerifyModalComponentComponent implements AfterViewInit{
  width = '15vw';
  left = '42vw';
  @Output() exit = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{response: string}>();
  constructor(public ViewContainerRef: ViewContainerRef ) {
    if (sessionStorage.getItem('device') == 'mobile') {
      this.width = '70vw';
      this.left = '12vw';
    }
   }

  ngAfterViewInit(){
  
  }

  deny(){
    this.exit.emit();
  }

  ok(){    
    this.confirm.emit({
      response: 'ok',
    });
  }

}
