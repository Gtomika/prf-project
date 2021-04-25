import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  //Egy vásárlás adatait tartalmazza

  @Input() //vásárolt termék neve
  productName: String = '';

  @Input() //ár
  price: String = '';

  @Input() //vásárlás dátuma
  purchaseDateTime: String = ''

  @Input() //vásárló
  username: String = '';

  constructor() { }

  ngOnInit(): void {
  }

}
