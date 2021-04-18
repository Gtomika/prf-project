import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventBrokerService } from 'ng-event-broker';
import { LoginService } from './login.service';
import { Events } from '../events.model';
 
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

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private eventService: EventBrokerService) { }

  ngOnInit(): void {
  }

  onLoginClick() {
    if(this.username == '' || this.password == '') {
      alert('Ki kell tölteni a bejelentkezési adatokat!');
      return;
    }
    this.loginService.login(this.username, this.password).subscribe(response => {
      console.log(response);
      //ha sikeres volt
      localStorage.setItem('username', this.username.toString()); //csak a felirathoz kell
      //bejelentkezési esemény küldése
      this.eventService.publishEvent(Events.login);
      this.router.navigate(['home']);
      this.username = '';
      this.password = '';
    }, error => {
      console.log(error);
      //ha nem volt jó
      alert('Bejelentkezési hiba');
      this.username = '';
      this.password = '';
    })
  }

  onRegisterClick() {
    this.router.navigate(['register']);
  }
 
}
