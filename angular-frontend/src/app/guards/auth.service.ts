import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Ez true lesz ha be van jelentkezve
  private authenticated: boolean;

  //Ez true lesz, ha a bejelentkezett felhasználó admin.
  private admin: boolean;

  //A bejelentkezett felhasználó neve.
  private username: String = '';

  //A bejelentkezett felhasználó jelszava.
  private password: String = '';

  constructor() { 
    this.authenticated = false;
    this.admin = false;
  }

  authenticate(isAdmin: boolean) {
    this.authenticated = true;
    this.admin = isAdmin;
  }

  cancelAuthenticate() {
    this.authenticated = false;
    this.admin = false;
    this.username = '';
    this.password = '';
  }

  isAuthenticated() : boolean {
    return this.authenticated;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  //bejelentkezett felhasználó adatait menti
  setCreditentials(username: String, password: String) {
    this.username = username;
    this.password = password;
  }

  getUsername() : String {
    return this.username;
  }

  getPassword() : String {
    return this.password;
  }
}
