import {  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-wallboard-settings',
  templateUrl: './wallboard-settings.component.html',
  styleUrls: ['./wallboard-settings.component.scss']
})
export class WallboardSettingsComponent implements AfterViewInit,OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() settingData = new EventEmitter<{queuename:'' ,settingData:[]}>();
  form: FormGroup;
  queueName: any;
  settingKeys: any;
  wallboardSettins:any; 
  selectedKeys:any[] = [];
  keysCombine:any[] = [];
  selectedValues:any[] = [];
  constructor(fb: FormBuilder, private cdr: ChangeDetectorRef) {
  document.body.style.overflow = 'auto';
   this.form = fb.group({
   })

   }

  ngAfterViewInit() {   
    

      this.keysCombine = this.settingKeys[0].sort((a:any, b:any) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
       setTimeout(() =>{   
     for (let items of this.wallboardSettins) 
     if (items.queuename == this.queueName)     
      this.selectedValues = Object.keys(items.settingData);
      this.showSelectedValues(this.selectedValues);
    },300)
    this.cdr.detectChanges();

  }

  exit() {
    this.close.emit();
  }

  indexDefination(index:any) {
    if (!this.selectedKeys.includes(index)) {
      this.selectedKeys.push(index);
      this.form.addControl(index,new FormControl);     
      this.form.controls[index].setValue({  
        visibility: true,      
        color1:'lightgreen',
        color2:'lightgreen',
        color3:'lightgreen',
        value1:'',
        value2:'',
        value3:'',      
      })
   
      if (this.valueFinder(this.wallboardSettins,index))
          this.form.controls[index].setValue(this.valueFinder(this.wallboardSettins,index))

    }
    else {
      this.selectedKeys.splice(this.selectedKeys.indexOf(index), 1);
      this.form.removeControl(index);

    }

  }

  showSelectedValues(data:any){
    this.selectedValues.forEach(items =>{
      this.indexDefination(items);
    })
  }

  setSettings() {
    this.settingData.emit({queuename:this.queueName, settingData: this.form.value});
  }

  ngOnDestroy(){
    document.body.style.overflow = 'auto';
  }

  valueFinder(data:any,index:any){    
    for (let i=0;i<data.length;++i) {
      if (data[i].settingData[index] && data[i].queuename == this.queueName)
      return data[i].settingData[index];
    }
  }

}
