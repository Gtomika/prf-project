import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  userEndpoint: String;

  constructor(private http: HttpClient) {
      this.userEndpoint = environment.nodejsServerUrl + '/api/user'
  }

  //postol a user endpointra
  registerUser(pUsername: String, pPassword: String) {
    return this.http.post(this.userEndpoint.toString(),
    {
      username: pUsername,
      password: pPassword
    },
    {
      responseType: 'text'
    });
  }
}
