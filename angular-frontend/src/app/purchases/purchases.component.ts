import { Component, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import { AuthService } from '../guards/auth.service';
import { PurchaseService } from './purchase.service';
import { PurchaseData } from './purchase/purchase.data';
import { Events } from '../events.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  //a vásárlásokat tartalmazza: ebből jönnek létre a vásárlások komponensei
  purchases: PurchaseData[] = [];

  username: String;

  //teljes vásárlási összeg
  total: String = '';

  constructor(
    private pruchaseService: PurchaseService,
    private authService: AuthService,
    private eventService: EventBrokerService) {
      this.username = authService.getUsername();
  }

  ngOnInit(): void {
     //töltés mutatása amíg a vásárlások nem töltődnek be
     setTimeout(() => {
      //később kell kezdődnie, vagy "Expression has changed after it was checked" hiba
      this.eventService.publishEvent(Events.showLoading);
      //a felhasználó vásárlásainak lekérése
      const pw = this.authService.getPassword();
      this.pruchaseService.queryUserPurchases(this.username, pw).subscribe(response => {
        this.eventService.publishEvent(Events.hideLoading);
        //várárlások a response-ban vannak
        this.onPurchasesQueried(response);
      }, error => {
        this.eventService.publishEvent(Events.hideLoading);
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Lekérési hiba!',
          text: error.error.message
        })
      });
  }, 10);
  }

  onPurchasesQueried(response: any) {
    let sum = 0;
    //vásárlás adat array feltöltése
    for(const purchaseJson of response) {
      const data = new PurchaseData(
        purchaseJson.username,
        purchaseJson.productName,
        purchaseJson.price,
        purchaseJson.dateTime
      );
      sum += purchaseJson.price;
      this.purchases.push(data);
    }
    this.total = sum + ' Ft';
    //rendezés vásárlási idő szerint
    this.purchases.sort((p1,p2) => {
      return p1.getTimestamp() - p2.getTimestamp();
    });
  }

}
