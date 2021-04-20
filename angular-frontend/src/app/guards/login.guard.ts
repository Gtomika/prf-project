import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //csak akkor enged tovább, ha be vagyunk jelentkezve
    if(this.authService.isAuthenticated()) {
      return true;
    } else {
      Swal.fire(
        {
          icon: 'error',
          title: 'Bejelentkezés kell!',
          text: 'Ahhoz, hogy ezt az oldalt megnézd, be kell jelentkezned!'
        }
      );
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
