import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  name: String = '';

  description: String = '';

  price: String = '';

  imgPath: String = '';

  username: string = '';

  constructor() { }

  ngOnInit(): void {
    const localUsername = localStorage.getItem('username');
    if(localUsername) {
      this.username = localUsername;
    } else {
      const validator = function(username: String) {
        if(!username) {
          return 'Kérlek add meg a felhasználóneved!';
        }
        return null;
      }
      //valamiért nincs a local storage-ban
      Swal.fire(
        {
          title: 'Felhasználónév',
          text: 'Valamiért nem találom a felhasználónevedet. Kérlek add meg!',
          icon: 'question',
          input: 'text',
          inputValue: this.username,
          inputPlaceholder: 'felhasználónév...',
          focusCancel: false,
          inputValidator: validator
        }
      );
    }
  }

  onBuyClicked() {
    //TODO
  }

}
