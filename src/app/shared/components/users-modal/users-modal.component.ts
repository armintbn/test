import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/admin/super-visor/users.service';
import { Update } from './update.model';



@Component({
  selector: 'ngx-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent implements OnInit,AfterViewInit {
  title:any;
  left = '15vw';
  width = '70vw';
  height = '25vh';
  form: FormGroup;
  entryData: any[] = [];
  entryData2: any[] = [];
  queues2: any[] = [];
  queues = [];
  technologies:any[] = [];
  technos = [];
  list:any[] = [];
  edit = false;
  update: any = {};
  c = 0;
  one = 'one';
  data: any;
  showPassword = true;
  @Output() close = new EventEmitter<void>();
  @Output() userData = new EventEmitter<{ data: any }>();
  constructor(fb: FormBuilder, private _snackBar: MatSnackBar,
    private userservice: UsersService,
  ) {
    this.form = fb.group({
      id: [null],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required,]],
      password: [null, [Validators.required]],
      password2: [null],
      password_confirmation: [null, [Validators.required]],
      password_confirmation2: [],
      email: [null, [Validators.required, Validators.email]],
      email2: [null],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      queues: [null, [Validators.required]],
      queues2: [null],
      technology: [[], [Validators.required]],
      technology2: [[]]
    });     
    
    this.form.reset();
    
  }

  passwordChecker() {
    if (!this.form.controls['password'].value) {
      this.form.controls['password_confirmation'].reset();
      this.openSnackBar( 'خطا', 'لطفا ابتدا رمز عبور را وارد کنید');
      return;

    }


    if (this.form.controls['password'].value.length === this.form.controls['password_confirmation'].value.length)
      if (this.form.controls['password'].value !== this.form.controls['password_confirmation'].value) {
        this.form.controls['password_confirmation'].reset();
        this.openSnackBar( 'خطا', 'اشتباه در تعریف رمزعبور و تکرار رمز عبور');

      }



  }

  ngOnInit() {   
    if (sessionStorage.getItem('device') == 'mobile') {
      this.width = '80vw';
      this.left = '5vw';
      this.height = '30vh';
   }     

  }

  ngAfterViewInit(){

setTimeout(() => {
let selectedTEchnologies:any[] = []; 
this.stateManagment(); 
    this.userservice.queuesWithMembers().subscribe(data => {      
      this.queues = data['queues'];           
      this.queues.sort((a:any, b:any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      if (this.data.queues.length)
      for (let i=0;i<this.data.queues.length;++i) {                 
        for (let j=0;j<this.queues.length;++j)  
          if (this.data.queues[i].name == this.queues[j]['name'])
           {
              for (let k=0;k<this.data.queues[i].members.length;++k) {
                this.technologies.push(JSON.stringify({ name: this.data.queues[i]['name'], members: [this.data.queues[i].members[k]]}));                        
                selectedTEchnologies.push(JSON.stringify({ name: this.data.queues[i]['name'], members: [this.data.queues[i].members[k]]}));                                     
              }                   
          }
        }
                                           
      setTimeout(() => {             
        let selector = { selected: true };
        if (this.data)
          if (this.data.queues.length) {
            for (let i = 0; i < this.data.queues.length; ++i) {
              if (!this.entryData.includes(this.data.queues[i].name) && this.data.queues[i].name)
                this.entryData.push(this.data.queues[i].name);                                                                                            
            }
            
            for (let j=0;j<this.data.queues.length;++j)  
                for (let k=0;k<this.queues.length;++k)  
                if (this.data.queues[j].name == this.queues[k]['name'] 
                  && this.data.queues[j].members != this.queues[k]['members'] ) {
                this.technology(this.queues[k],selector,1);                                   
                }
                
                
            this.entryData2=selectedTEchnologies;
            this.form.controls['queues'].setValue(this.entryData);
            this.form.controls['technology'].setValue(this.entryData2);
            
          }
      }, 100);
    });
    
  },450);
   
  }

  exit() {
    this.close.emit();
  }

  user() {
    
    this.update = this.form.value;
    if (this.title != 'افزودن کاربر') {
      if (this.form.controls['password'].value || this.form.controls['password_confirmation'].value)
        if (this.form.controls['password'].value != this.form.controls['password_confirmation'].value) {
          this.openSnackBar('خطا', 'رمر و تایید رمز برابر نیستند');
          return;
        }
    }
    if (this.form.controls['id'].value) {    
      if (!this.form.controls['last_name'].dirty)  
      delete this.update.last_name;
      if (!this.form.controls['first_name'].dirty)
      delete (this.update['first_name']);
      if (!this.form.controls['email'].dirty)
        delete (this.update['email']);
      if (!this.form.controls['password'].dirty)
        delete (this.update['password']);
        if (!this.form.controls['mobile'].dirty)
         delete (this.update['mobile']);
      if (!this.form.controls['password_confirmation'].dirty)
        delete (this.update['password_confirmation']);
      if (!this.form.controls['queues'].dirty)
        delete (this.update['queues']);
      if (!this.form.controls['technology'].dirty)
        delete (this.update['technology']);
      if (this.form.controls['technology'].value) {
        this.form.controls['queues'].setValue([]);
         
          for (let i = 0; i < this.form.controls['technology'].value.length; ++i) {            
              if (this.form.controls['technology'].value[i][0] == '{')
              this.form.controls['technology'].value[i] = JSON.parse(this.form.controls['technology'].value[i]);              
              this.form.controls['queues'].value.push({ name: this.form.controls['technology'].value[i].name, members: [this.form.controls['technology'].value[i].members] });           
              
            }            
            this.relator(this.form.controls['queues'].value) ;  
              if (this.form.controls['queues'].dirty || this.form.controls['technology'].dirty)           
               this.update['queues'] = this.form.controls['queues'].value;
      }

      delete (this.update['email2']);
      delete (this.update['password2']);
      delete (this.update['password_confirmation2']);
      delete (this.update['queues2']);
      delete (this.update['technology2']); 
      delete (this.update['technology']);     

      this.userData.emit({ data: this.update });
    }

    if (!this.form.controls['id'].value)
      if (this.form.valid) {
        if (this.form.controls['queues']) {
          this.form.controls['queues'].setValue([]);
          for (let i = 0; i < this.form.controls['technology'].value.length; ++i)
            this.form.controls['queues'].value.push({ name: this.form.controls['technology'].value[i].name, members: [this.form.controls['technology'].value[i].members] });
        }
        this.relator(this.form.controls['queues'].value);          
         this.userData.emit({ data: this.form.value });
      }

      
  }



  

  convertor(data: any){
    let obj = []; 
    if (data instanceof Object) {    
    return data['members']['name'];
    }
    obj = JSON.parse(data);
    return obj['members'][0]['name'];
  }




  technology(queue:any, selector:any, index:any) {
    if (!selector['selected']) {
      for (let i = 0; i < this.list.length; ++i)
        if (this.list[i]['name'] == queue['name'] ) {
          this.list.splice(i, 1);
          if (!this.list.length) this.list = [];
        }

      while (this.technologies[this.c] && this.list.length) {
        if (this.technologies[this.c].name == queue['name']) {
          this.technologies.splice(this.c, 1);
        }
        else
          this.c++;
      }
      this.c = 0
      if (!this.list.length)
        this.technologies = [];


    }


    if (selector['selected']) {
      this.list.push(queue);
      for (let i = 0; i < queue['members'].length; ++i)  
        this.technologies.push({ name: queue['name'], members: queue['members'][i] });      
    }
   if (!this.form.controls['id'].value)
    this.technologies.sort((a, b) => (a.members.name > b.members.name ? 1 : -1));
  }

  relator(data:any) {
    let queueNames:any[] = [];
    let queue = [];
    let agentQueue:any[] = [];
    let members = [];

    for (let i = 0; i < data.length; ++i)
      if (!queueNames.includes(data[i].name))
        queueNames.push(data[i].name);

        for (let i = 0; i < data.length; ++i)  
        { 
         
          if (data[i] instanceof String)
          data[i]=JSON.parse(data[i]);
          queue.push(data[i]);
          

        }

     for (let i = 0; i < queueNames.length; ++i) {
      members = [];      
      for (let j = 0; j < queue.length; ++j)
        if (queueNames[i] == queue[j].name) {
           if (queue[j].members[0].length)
           queue[j].members[0] = queue[j].members[0][0];
           members.push(queue[j].members[0])
           agentQueue.push({ name: queue[j].name, members: members });           
        }
    }

    const uniqueArray = agentQueue.filter((thing, index) => {
      const _thing = JSON.stringify(thing);
      return index === agentQueue.findIndex(obj => {
        return JSON.stringify(obj) === _thing;
      });
    });
      

    this.form.controls['queues'].setValue(uniqueArray);

  }

stateManagment(){
  if (this.data) {            
    this.form.reset(this.data);      
    this.form.controls['queues'].setValue(this.data.queues);
    this.form.controls['email2'].setValue(this.form.controls['email'].value);
    this.form.controls['password'].setValue(this.form.controls['password2'].value);
    this.form.controls['password_confirmation2'].setValue(this.form.controls['password_confirmation'].value);
    this.form.controls['queues2'].setValue(this.form.controls['queues'].value);
    this.form.controls['technology2'].setValue(this.form.controls['technology'].value);
    this.update = this.form.value;   
}
}
  
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 5000,
  });

}
}
