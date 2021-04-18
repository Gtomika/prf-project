import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';
import { EventBrokerService } from 'ng-event-broker';
import { Events } from './events.model';

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

  loggedIn: boolean;

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private eventService: EventBrokerService) {

    this.loginLogoutStatusText = "Nem vagy bejelentkezve!";
    this.loginLogoutButtonText = "Bejelentkezés";
    this.loggedIn = false;
  }

  ngOnInit() {
      //események regisztrálása
      this.eventService.registerEvent(Events.login);
      this.eventService.registerEvent(Events.logout);

      //feliratkozás az eseményekre
      this.eventService.subscribeEvent(Events.login).subscribe(val => {
          this.updateWhenLoggedIn();
      });
      this.eventService.subscribeEvent(Events.logout).subscribe(val => {
          this.updateWhenLoggedOut();
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
  }

  //meghívódik kiejelentkezéskor, frissíti a felhasználói felületet és a loggedIn változót
  updateWhenLoggedOut() {
    this.loggedIn = false;
    this.loginLogoutButtonText = 'Bejelentkezés';
    this.loginLogoutStatusText = 'Nem vagy bejelentkezve!';
  }
}
