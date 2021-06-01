import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-button-modal',
  templateUrl: './button-modal.component.html',
  styleUrls: ['./button-modal.component.scss']
})
export class ButtonModalComponent implements OnInit {
  title = '';
  left = '22vw';
  width = '55vw';
  height = '15vh';
  @Output() close = new EventEmitter<void>();
  @Output() buttonData = new EventEmitter<{ data: any }>();
  @Input() form: FormGroup;
  @Input() data: any;
  queues: any;
  constructor(fb: FormBuilder) {

    this.form = fb.group({
      id: [],
      name: [null, [Validators.required]],
      description: [''],
      queue_name: [null, [Validators.required]],
      color: ['black'],


    });

    if (this.data.id)
    {
      if (this.data.name == '#no_answer_pause#')
      this.data.name = 'وقفه به دلیل عدم پاسخگویی';
      this.form.reset(this.data);
    }
    
  }


  ngOnInit() {
    if (sessionStorage.getItem('device') == 'mobile') {
      this.width = '80vw';
      this.left = '7vw';
      this.height = '30vh';

   }
    if (this.form.valid)
      this.title = 'ویرایش آیتم';
    else
      this.title = 'افزودن آیتم';
  }

  exit() {
    this.close.emit();
  }

  confirm() {
    if (this.form.valid)
      this.buttonData.emit({
        data: this.form.value,
       }); 
       //else
      // this.showToast(2000, 'خطا ', 'اطلاعات وارد شده کامل نیست');
  }



  // showToast(duration, title, message) {
  //   this.toastrServie.show(
  //     message,
  //     title,
  //     { duration });
  // }

}
