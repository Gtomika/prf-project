import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //Login és logout api hívások a szerver felé

  constructor(private http: HttpClient) { }

  login(pUsername: String, pPassword: String) {
    const loginEndpoint = environment.nodejsServerUrl + '/api/login';
    return this.http.post(loginEndpoint,
    {
      username: pUsername,
      password: pPassword
    },
    {
      responseType: 'text'
    });
  }

  logout() {
    const logoutEndpoint = environment.nodejsServerUrl + '/api/logout'
    return this.http.post(logoutEndpoint, {}, {responseType: 'text'});
  }
}
