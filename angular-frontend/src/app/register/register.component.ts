import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { RegisterService } from './register.service';
import { Events } from '../events.model';
import { EventBrokerService } from 'ng-event-broker';
import Swal from 'sweetalert2'
import { Validators, FormControl } from '@angular/forms';

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

  //megerősítés
  passwordAgain: String = '';

  notEmptyUsernameControl = new FormControl('', [
    Validators.required
  ]);

  notEmptyPasswordControl = new FormControl('', [
    Validators.required
  ]);

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
      Swal.fire({
        title: 'Hiányos adatok!',
        text: 'Meg kell adnod a felhasználónevet és a jelszót is!',
        icon: 'error'
      });
      return;
    }
    if(this.username.length <=3 || this.password.length <= 3) {
      Swal.fire({
        title: 'Hibás adatok!',
        text: 'Legalább 3 karakteres felhasználónevet és a jelszót kell adnod!',
        icon: 'error'
      });
      return;
    }
    if(this.password !== this.passwordAgain) {
      Swal.fire({
        title: 'Hibás adatok!',
        text: 'A jelszónak és a megerősítő jelszónak meg kell egyezniük!',
        icon: 'error'
      });
      return;
    }
    //töltés mutatása
    this.eventService.publishEvent(Events.showLoading);

    this.registerService.registerUser(this.username, this.password).subscribe(response => {
      console.log(response);
      localStorage.setItem('username', this.username.toString()); //felhasználónév mentése
      //sikeres regisztáció, egyből bejelentkeztetés
      this.loginService.login(this.username, this.password).subscribe(response => {
          //login esemény küldése
          const admin = this.isAdmin(response);
          this.eventService.publishEvent(Events.login, admin);
          this.router.navigate(['home']);
          //töltés elrejtése
          this.eventService.publishEvent(Events.hideLoading);
          Swal.fire(
            {
              icon: 'success',
              title: 'Sikeres regisztráció!',
              text: 'Egyből be is lettél jelentkeztetve!'
            }
          );
      }, error => {
          //töltés elrejtése
          this.eventService.publishEvent(Events.hideLoading);
          Swal.fire(
            {
              icon: 'warning',
              title: 'Bejelentkezési hiba!',
              text: 'Sikeres regisztáció. Próbálj meg most belépni.'
            }
          );
      });
    }, error => {
      //töltés elrejtése
      console.log(error);
      this.eventService.publishEvent(Events.hideLoading);
      Swal.fire(
        {
          icon: 'error',
          title: 'Sikertelen regisztráció!',
          text: error.error.message
        }
      );
    });
  }

  isAdmin(response: any): boolean {
    return response.isAdmin === true;
  }
}
