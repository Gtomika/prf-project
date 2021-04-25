import { Component, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import Swal from 'sweetalert2';
import { ProductService } from '../products/product.service';
import { Events } from '../events.model';
import { PurchaseService } from '../purchases/purchase.service';
import { PurchaseData } from '../purchases/purchase/purchase.data';
import { AuthService } from '../guards/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  //admin felhasználóneve
  username: String;

  //admin jelszava
  password: string;

  //Megmondja, hogy a feltöltöt fájl terméket hoz létre, vagy frissít
  isUpdate: boolean = false;

  //A választot fájl
  file: any;

  //A törlendő termék neve
  productDeleteName: String = '';

  //Annak a terméknek a neve, amelyik vásárlási adatait le akarjuk kérni
  productPuchaseName: String = '';

  //Megmondja, hogy volt-e sikeres vásárlási lekérés
  purchasesQueried: boolean = false;

  //Megadja, hogy a lekért termék mennyi bevételt termelt.
  productTotal: String = '';

  //Megadja, hogy mikor vásárolták meg utoljára az adott terméket.
  lastPurchased: String = '';

  //ennyiszer vásárolták meg a terméket.
  numOfPurchases: number = 0;

  //A lekért termék vásárlási adatai
  purchases: PurchaseData[] = [];

  constructor(
    private productService: ProductService,
    private eventService: EventBrokerService,
    private purchaseService: PurchaseService,
    private authService: AuthService) { 
    this.file = {};
    this.username = authService.getUsername();
    this.password = ''; //jelszót is ell lehetne kérni, de így "komolyabb"
  }

  ngOnInit(): void {}

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
      text: 'A leíró JSON fájlnak tartalmazni kell a következő mezőket: name, description, price, imgPath. Egy példáért lásd a docs mappában lévő JSON fájlt.',
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

  onPurchaseDataClicked() {
    if(this.productPuchaseName.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Terméknév',
        text: 'Meg kell adnod egy terméknevet!'
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
        this.sendProductPurchaseQuery();
      });
    } else {
      //már van jelszó
      this.sendProductPurchaseQuery();
    }
  }

  sendProductPurchaseQuery() {
    this.eventService.publishEvent(Events.showLoading);
    this.purchaseService.queryProductPurchases(this.username, this.password, this.productPuchaseName)
    .subscribe(response => {
        this.eventService.publishEvent(Events.hideLoading);
        this.onProductPurchasesQueried(response)
        this.purchasesQueried = true; //adatok mutatása
    }, error => {
        console.log(error);
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire({
          icon: 'error',
          title: 'Lekérési hiba!',
          text: error.error.message
        });
    });
  }

  onProductPurchasesQueried(response: any) {
    let sum = 0;
    let lastTimestamp = 0;
    for(const purchaseJson of response) {
      const data = new PurchaseData(
        purchaseJson.username,
        purchaseJson.productName,
        purchaseJson.price,
        purchaseJson.dateTime
      );
      //teljes bevétel és utolsó vásárlás számolása
      sum += purchaseJson.price;
      if(purchaseJson.dateTime > lastTimestamp) {
        lastTimestamp = purchaseJson.dateTime;
      }
      this.purchases.push(data);
    }
    //kiírt adatok formázása
    this.numOfPurchases = response.length;
    this.productTotal = sum + ' Ft';
    if(lastTimestamp == 0) {
      //nem volt vásárlás
      this.lastPurchased = 'Ezt a terméket még nem vásárolták meg.'
    } else {
      const date = new Date();
      date.setTime(lastTimestamp * 1000);
      this.lastPurchased = date.toUTCString();
    }
  }
}
