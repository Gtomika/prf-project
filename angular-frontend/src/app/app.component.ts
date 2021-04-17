import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  //A bejelentkezési státuszt mutatja
  loginLogoutStatusText: String;

  //A bejelentkező/kijelentkező gomb szövege
  loginLogoutButtonText: String;

  constructor(private router: Router) {
    this.loginLogoutStatusText = "Nem vagy bejelentkezve!";
    this.loginLogoutButtonText = "Bejelentkezés";
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

    this.router.navigate(['login']);
  }

}
