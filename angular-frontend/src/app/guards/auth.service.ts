import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Ez true lesz ha be van jelentkezve
  private authenticated: boolean;

  //Ez true lesz, ha a bejelentkezett felhasználó admin.
  private admin: boolean;

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
  }

  isAuthenticated() : boolean {
    return this.authenticated;
  }

  isAdmin(): boolean {
    return this.admin;
  }
}
