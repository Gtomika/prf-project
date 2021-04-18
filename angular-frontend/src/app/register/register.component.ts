import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { RegisterService } from './register.service';
import { Events } from '../events.model';
import { EventBrokerService } from 'ng-event-broker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //beírt felhasználónév
  username: String = '';

  //beírt jelszó
  password: String = '';

  constructor(
    private router: Router, 
    private registerService: RegisterService,
    private loginService: LoginService, 
    private eventService: EventBrokerService) { }

  ngOnInit(): void {
  }

  onLoginClick() {
    this.router.navigate(['login']);
  }

  onRegisterClick() {
    if(this.username == '' || this.password == '') {
      alert('Meg kell adnod az adatokat!');
      return;
    }
    if(this.username.length <=3 || this.password.length <= 3) {
      alert('Legalább 3 karakter hosszú felhasználónév és jelszó kell!');
      return;
    }
    this.registerService.registerUser(this.username, this.password).subscribe(response => {
      //sikeres regisztáció, egyből bejelentkeztetés
      this.loginService.login(this.username, this.password).subscribe(response => {
          localStorage.setItem('username', this.username.toString()); //csak a felirathoz kell
          //login esemény küldése
          this.eventService.publishEvent(Events.login);
          this.router.navigate(['home']);
      }, error => {
          alert('Sikeres regisztráció, de sikertelen belépés. Próbálj meg újra belépni.')
      });
      this.username = '';
      this.password = '';
    }, error => {
      alert('Sikertelen regisztráció: ' + error);
      this.username = '';
      this.password = '';
    });
  }

}
