import { Component, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import Swal from 'sweetalert2';
import { ProductService } from '../products/product.service';
import { Events } from '../events.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  username: string;

  password: string;

  isUpdate: boolean = false;

  file: any;

  productDeleteName: String = '';

  constructor(
    private productService: ProductService,
    private eventService: EventBrokerService) { 
    this.file = {};
    this.username = '';
    this.password = '';
  }

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
      Swal.fire({
        title: 'Felhasználónév',
        text: 'Valamiért nem találom a felhasználónevedet. Kérlek add meg!',
        icon: 'question',
        input: 'text',
        inputValue: this.username,
        inputPlaceholder: 'felhasználónév...',
        focusCancel: false,
        inputValidator: validator
      });
    }
  }

  fileChanged(selector: any) {
    new Response(selector.target.files[0]).json().then(json => {
      this.file = json;
    }, err => {
      // nincs fájl vagy nem json
    })
  }

  onHelpClicked() {
    Swal.fire({
      title: 'Termék formátum',
      text: 'A leíró JSON fájlnak tartalmazni kell a következő mezőket: name, description, price, imgPath',
      icon: 'info'
    });
  }

  onCreateUpdateClicked() {
    if(!this.file.name || !this.file.description || !this.file.price || !this.file.imgPath) {
      Swal.fire({
        title: 'Hiányos fájl!',
        text: 'Először válassz egy megfelelő JSON fájlt!',
        icon: 'error'
      });
    } else {
      //megvan a fájl a megfelelő mezőkkel
      //admin jelszó kérése ha még nem adta meg
      if(this.password === '') {
        const validator = function(username: String) {
          if(!username) {
            return 'Kérlek add meg az admin jelszót!';
          }
          return null;
        }
        Swal.fire({
          title: 'Jelszó',
          text: 'Ehhez a művelethez az admin jelszavad kell!',
          icon: 'warning',
          input: 'password',
          inputValue: this.password,
          inputPlaceholder: 'jelszó...',
          focusCancel: false,
          inputValidator: validator
        }).then(value => {
          //megadta a jelszót
          this.password = value.value;
          this.sendUpdateCreate();
        });
      } else {
        //már megvan a jelszó
        this.sendUpdateCreate();
      }
      
    }
  }

  sendUpdateCreate() {
    this.eventService.publishEvent(Events.showLoading);
    if(this.isUpdate) {
      //ez frissítés
      this.productService.updateProduct(this.username, this.password, this.file.name, 
          this.file.description, this.file.price, this.file.imgPath)
      .subscribe(response => {
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire({
          icon: 'success',
          title: 'Siker!',
          text: 'A termék frissítve lett!'
        });
      }, error => {
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire({
          icon: 'error',
          title: 'Frissítési hiba!',
          text: error.error.message
        });
      });
    } else {
      //ez létrehozás
      this.productService.createProduct(this.username, this.password, this.file.name, 
          this.file.description, this.file.price, this.file.imgPath)
      .subscribe(response => {
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire({
          icon: 'success',
          title: 'Siker!',
          text: 'A termék létre lett hozva!'
        });
      }, error => {
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire({
          icon: 'error',
          title: 'Létrehozási hiba!',
          text: error.error.message
        });
      });
    }
  }

  onDeleteClicked() {
    if(this.productDeleteName === '') {
      Swal.fire({
        icon: 'error',
        title: 'Terméknév',
        text: 'Meg kell adnod a termék nevét!'
      });
      return;
    }
    if(this.password === '') {
      //még nincs jelszó
      const validator = function(username: String) {
        if(!username) {
          return 'Kérlek add meg az admin jelszót!';
        }
        return null;
      }
      Swal.fire({
        title: 'Jelszó',
        text: 'Ehhez a művelethez az admin jelszavad kell!',
        icon: 'warning',
        input: 'password',
        inputValue: this.password,
        inputPlaceholder: 'jelszó...',
        focusCancel: false,
        inputValidator: validator
      }).then(value => {
        //megadta a jelszót
        this.password = value.value;
        this.sendDelete();
      });
    } else {
      //már van jelszó
      this.sendDelete();
    }
  }

  sendDelete() {
    this.eventService.publishEvent(Events.showLoading);
    this.productService.deleteProduct(this.username, this.password, this.productDeleteName)
    .subscribe(response => {
      this.eventService.publishEvent(Events.hideLoading);
      Swal.fire({
        icon: 'success',
        title: 'Siker',
        text: 'A termék törölve lett!'
      });
    }, error => {
      this.eventService.publishEvent(Events.hideLoading);
      Swal.fire({
          icon: 'error',
          title: 'Törlési hiba!',
          text: error.error.message
      });
    });
  }

}
