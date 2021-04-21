import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productEndpoint: String;

  constructor(private http: HttpClient) {
    this.productEndpoint = environment.nodejsServerUrl + '/api/product';
  }

  createProduct(username: String, password: String, name: String, description: String, price: String, imgPath: String) {
      return this.http.post(this.productEndpoint.toString(), {
          username: username,
          password: password,
          name: name,
          description: description,
          price: price,
          imgPath: imgPath
      },
      {
        withCredentials: true
      });
  }

  updateProduct(username: String, password: String, name: String, description: String, price: String, imgPath: String) {
      return this.http.put(this.productEndpoint.toString(), {
          username: username,
          password: password,
          name: name,
          description: description,
          price: price,
          imgPath: imgPath
      },
      {
      withCredentials: true
      });
  }

  deleteProduct(username: String, password: String, name: String) {
      return this.http.request('delete', this.productEndpoint.toString(),{
        withCredentials: true,
        body: {
          username: username,
          password: password,
          name: name
        }
      });
  }
}
