import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  /*
  Az egyetlen service, ami nem a nodeJs szerverhez, hanem a Spring Boot-oshoz kapcsolódik.
  */

  private purchaseEndpoint: String;

  private productPurchaseEndpoint: String;

  constructor(private http: HttpClient) {
      this.purchaseEndpoint = environment.javaeeServerUrl + '/api/purchase';
      this.productPurchaseEndpoint = environment.javaeeServerUrl + '/api/productTotal';
  }

  savePurchase(username: String, password: String, productName: String, price: String, timestamp: String) {
      return this.http.post(this.purchaseEndpoint.toString(), {
        username: username,
        password: password,
        productName: productName,
        price: price,
        dateTime: timestamp
      });
  }

  queryUserPurchases(username: String, password: String) {
    const url = this.purchaseEndpoint + '?username=' + username + '&password=' + password;
    return this.http.get(url, {
      responseType: 'json'
    });
  }

  queryProductPurchases(username: String, password: String, productName: String) {
    const url = this.productPurchaseEndpoint + '?username=' + username + '&password=' + password + '&productName=' + productName;
    return this.http.get(url, {
      responseType: 'json'
    });
  }

}
