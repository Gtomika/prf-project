import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productEndpoint: String;

  imageEndpoint: String;

  constructor(private http: HttpClient) {
    this.productEndpoint = environment.nodejsServerUrl + '/api/product';
    this.imageEndpoint = environment.nodejsServerUrl + '/api/image';
  }

  queryProducts() {
    return this.http.request('get', this.productEndpoint.toString(), {
      withCredentials: true
    });
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

  queryProductImage(pImgPath: String) {
      const split = pImgPath.split('/');
      const imageName = split[split.length - 1];
      const url = environment.nodejsServerUrl + '/api/images?imageName=' + imageName;
      console.log(url);
      return this.http.get(url, {
         withCredentials: true,
         responseType: 'blob' 
      });
  }
}
