import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router,  private _snackBar: MatSnackBar) { }


  intercept(req: HttpRequest<any>, next: HttpHandler):any {
    const modifiedreq = sessionStorage.getItem('token');
    if (!modifiedreq)
      return next.handle(req);
    const tokenReq: HttpRequest<any> = req.clone({
      setHeaders: {
        Authorization: `Bearer ${modifiedreq}`
      },
    });
    return next.handle(tokenReq).toPromise().catch((error:HttpErrorResponse) =>{
       if (error.status == 401 || error.status == 400){
       sessionStorage.clear();     
       this.router.navigateByUrl('login');
    } 
    
      if (!error.status || error.status > 500) {
          this.openSnackBar('مشکل در ارتباط با سرور','خطا'); 
          return;
      }
      this.openSnackBar('خطا','خطا در انجام عملیات');       
  });    
   
}

openSnackBar(message: any, action: string) {
  this._snackBar.open(message, action, {
    duration: 5000,
  });
}

}
