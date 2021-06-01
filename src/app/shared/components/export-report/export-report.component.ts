import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fileSaver from 'file-saver';
import { UsersService } from 'src/app/admin/super-visor/users.service';

@Component({
  selector: 'mahan-export-report',
  templateUrl: './export-report.component.html',
  styleUrls: ['./export-report.component.scss']
})
export class ExportReportComponent  {

  @Input() url = '';
  @Input() fileName = '';
  
constructor(private userservice: UsersService, private _snackBar: MatSnackBar,){}
  tableToExcel(type:any) {    
    this.userservice.MakeReportFile(type,this.url).subscribe(data => {
      let blob: any = new Blob([data], { type: 'text/json; charset=utf-8' });
      if (type == 'excel') type = 'xlsx';
      fileSaver.saveAs(blob, `${this.fileName}.${type}`);     
  },(error:HttpErrorResponse) => {         
    this.openSnackBar(error.message,String(error.status))
   
})

}


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
