import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLoginClick() {
    this.router.navigate(['login']);
  }

  onRegisterClick() {
    
  }

}
