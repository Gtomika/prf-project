import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLoginClick() {

  }

  onRegisterClick() {
    this.router.navigate(['register']);
  }
 
}
