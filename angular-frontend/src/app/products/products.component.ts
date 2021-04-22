import { Component, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import { Events } from 'src/app/events.model';
import Swal from 'sweetalert2';
import { ProductService } from './product.service';
import { ProductData } from './product.data';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  /*
  Ez az array tartalmazza a termékeket leíró információkat.
  */
  products: ProductData[];

  constructor(
    private eventService: EventBrokerService,
    private productService: ProductService) { 
      this.products = [];
  }

  ngOnInit(): void {
      //töltés mutatása amíg a termékek nem töltődnek be
      setTimeout(() => {
          //később kell kezdődnie, vagy "Expression has changed after it was checked" hiba
          this.eventService.publishEvent(Events.showLoading);
          this.productService.queryProducts().subscribe(response => {
             this.onProductsQueried(response);
          }, error => {
              this.eventService.publishEvent(Events.hideLoading);
              Swal.fire({
                icon: 'error',
                title: 'Termék hiba',
                text: error.error.message
              });
          });
      }, 10);
  }

  onProductsQueried(response: any) {
      this.eventService.publishEvent(Events.hideLoading);
      //termék array feltöltése
      for(const productJson of response) {
        const productData = new ProductData(
          productJson.name,
          productJson.description,
          productJson.price,
          productJson.imgPath
        );
        this.products.push(productData);
      }
  }

}
