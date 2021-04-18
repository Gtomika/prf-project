import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { EventBrokerService } from 'ng-event-broker';
import { Observable } from 'rxjs';
import { Events } from '../events.model';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private loggedIn: boolean;

  constructor(private router: Router, private eventService: EventBrokerService) {
    this.loggedIn = false;

    //feliratkozás a login és logout eseményekre
    this.eventService.subscribeEvent(Events.login).subscribe(val => {
        this.loggedIn = true;
    });
    this.eventService.subscribeEvent(Events.logout).subscribe(val => {
        this.loggedIn = false;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //csak akkor enged tovább, ha be vagyunk jelentkezve
    if(this.loggedIn) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
