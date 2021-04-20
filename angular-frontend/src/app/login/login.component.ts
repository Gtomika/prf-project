import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventBrokerService } from 'ng-event-broker';
import { LoginService } from './login.service';
import { Events } from '../events.model';
import Swal  from 'sweetalert2'
import { Validators, FormControl } from '@angular/forms';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //beírt felhasználónév
  username: String = '';

  //beírt jelszó
  password: String = '';

  notEmptyUsernameControl = new FormControl('', [
      Validators.required
  ]);

  notEmptyPasswordControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private eventService: EventBrokerService) { }

  ngOnInit(): void {
  }

  onLoginClick() {
    if(this.username == '' || this.password == '') {
      Swal.fire({
        title: 'Hiányos adatok!',
        text: 'Meg kell adnod a felhasználónevet és a jelszót is!',
        icon: 'error'
      });
      return;
    }
    //töltés mutatása
    this.eventService.publishEvent(Events.showLoading);
  
    this.loginService.login(this.username, this.password).subscribe(response => {
      console.log(JSON.stringify(response));
      //ha sikeres volt
      localStorage.setItem('username', this.username.toString()); //csak a felirathoz kell
      const isAdmin = this.isAdmin(response);
      //bejelentkezési esemény küldése
      this.eventService.publishEvent(Events.login, isAdmin);
      //töltés elrejtése
      this.eventService.publishEvent(Events.hideLoading);
    }, error => {
      console.log(error);
      //töltés elrejtése
      this.eventService.publishEvent(Events.hideLoading);
      //ha nem volt jó
      Swal.fire(
        {
          icon: 'error',
          title: 'Sikertelen bejelentkezés!',
          text: error.error.message
        }
      );
    })
  }

  isAdmin(response: any): boolean {
    return response.isAdmin === true;
  }

  onRegisterClick() {
    this.router.navigate(['register']);
  }
 
}
