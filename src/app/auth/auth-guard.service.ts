import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  index = 0;
  constructor(private route: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot):any  {
    if (sessionStorage.getItem('token'))
      return true;
    else
      this.route.navigateByUrl('/login');
  }
}
