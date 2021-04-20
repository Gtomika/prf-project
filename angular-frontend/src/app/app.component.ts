import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';
import { EventBrokerService } from 'ng-event-broker';
import { Events } from './events.model';
import { AuthService } from './guards/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  //A bejelentkezési státuszt mutatja
  loginLogoutStatusText: String;

  //A bejelentkező/kijelentkező gomb szövege
  loginLogoutButtonText: String;

  //Ha ez igaz, akkor van bejelentkezett felhasználó
  loggedIn: boolean;

  //Ha ez igaz, akkor látszani fog a töltés jelző
  loading: boolean;

  //Admin esetén igaz. Ez csak a felhasználói felülethez kell, valójában az AuthService ellenörzi
  adminLoggedIn: boolean;

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private eventService: EventBrokerService,
    private authService: AuthService) {

    this.loginLogoutStatusText = "Nem vagy bejelentkezve!";
    this.loginLogoutButtonText = "Bejelentkezés";
    this.loggedIn = false;
    this.loading = false;
    this.adminLoggedIn = false;
  }

  ngOnInit() {
      //események regisztrálása
      this.eventService.registerEvent(Events.login);
      this.eventService.registerEvent(Events.logout);
      this.eventService.registerEvent(Events.showLoading);
      this.eventService.registerEvent(Events.hideLoading);

      //feliratkozás az eseményekre
      this.eventService.subscribeEvent(Events.login).subscribe(isAdmin => {
          console.log('AppComponent received logged in!');
          this.authService.authenticate(isAdmin); //ez kell a guardnak
          this.adminLoggedIn = isAdmin;
          this.updateWhenLoggedIn();
      });
      this.eventService.subscribeEvent(Events.logout).subscribe(val => {
          console.log('AppComponent received logged out!');
          this.authService.cancelAuthenticate(); //guard most már nem enged tovább
          this.updateWhenLoggedOut();
      });
      this.eventService.subscribeEvent(Events.showLoading).subscribe(val => {
          console.log('AppComponent received show loading!');
          this.loading = true;
      });
      this.eventService.subscribeEvent(Events.hideLoading).subscribe(val => {
        console.log('AppComponent received hide loading!');
        this.loading = false;
    });
  }

  onHomeClicked() {
    this.router.navigate(['home']);
  }

  onProductsClicked() {
    this.router.navigate(['products']);
  }

  onAboutClicked() {
    this.router.navigate(['about']);
  }

  onAdminStatusClicked() {
    this.router.navigate(['admin']);
  }

  onUserClicked() {
    this.router.navigate(['user']);
  }

  onLoginLogoutClicked() {
    if(this.loggedIn) {
      //be van jelentkezve
      this.loginService.logout().subscribe(message => {
        //logout esemény küldése
        this.eventService.publishEvent(Events.logout);
        this.router.navigate(['login']);
      }, error => {
        alert('Sikertelen kijelentkezés: ' + error);
      });
    } else {
      //nincs bejelentkezve, átirányít a login komponensre
      this.router.navigate(['login']);
    }
  }

  //meghívódik bejelentkezéskor, frissíti a felhasználói felületet és a loggedIn változót
  updateWhenLoggedIn() {
    this.loggedIn = true;
    this.loginLogoutButtonText = 'Kijelentkezés';
    //ezt a bejelentkezést végző komponens berakta a local storage-ba
    const username = localStorage.getItem('username');
    this.loginLogoutStatusText = 'Üdv, ' + username + '!';
    this.router.navigate(['home']);
  }

  //meghívódik kiejelentkezéskor, frissíti a felhasználói felületet és a loggedIn változót
  updateWhenLoggedOut() {
    this.loggedIn = false;
    this.adminLoggedIn = false;
    this.loginLogoutButtonText = 'Bejelentkezés';
    this.loginLogoutStatusText = 'Nem vagy bejelentkezve!';
  }
}
