import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/*
Kicsit téves az elnevezés, ez nem csak regisztál, hanem kezeli is a felhasználót,
POST, PUT, DELETE a /user-re.
*/

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
      withCredentials: true
    });
  }

  updateUserPassword(pUsername: String, pPassword: String, pNewPassword: String) {
    return this.http.put(this.userEndpoint.toString(), 
    {
      username: pUsername,
      password: pPassword,
      newPassword: pNewPassword
    },
    {
      withCredentials: true
    });
  }

  deleteUser(pUsername: String, pPassword: String) {
    return this.http.request('delete', this.userEndpoint.toString(), 
    {
      withCredentials: true, 
      body: {
        username: pUsername,
        password: pPassword
      }
    }
    );
  }

}
