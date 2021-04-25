import { Component, Input, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import { Events } from 'src/app/events.model';
import { AuthService } from 'src/app/guards/auth.service';
import { PurchaseService } from 'src/app/purchases/purchase.service';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input()
  name: String = '';

  @Input()
  description: String = '';

  @Input()
  price: String = '';

  @Input()
  imgPath: String = '';

  username: String;

  //ez kerül mutatásra, ha a kép betöltődött
  imageToShow: any;

  //jelzi, hogy betöltött-e a kép
  imageLoaded: boolean;

  constructor(
    private productService: ProductService, 
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private eventService: EventBrokerService) { 
      this.imageLoaded = false;
      this.username = authService.getUsername();
  }

  ngOnInit(): void {
    //induláskor kérjük a képet
    this.productService.queryProductImage(this.imgPath).subscribe(response => {
        console.log('Kép megkapva a ' + this.name + ' komponenshez!');
        this.createImageFromBlob(response);
    }, error => {
        //nem kaptunk képet, ilyenkor nem történik semmi, a teréknek nem lesz látható képe
    });
  }

  createImageFromBlob(image: any) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.imageLoaded = true;
        this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

  onBuyClicked() {
    Swal.fire({
      title: 'Biztosan szeretnéd megvásárolni?',
      text: 'Ez a ' + this.name + ' ' + this.price + '-ba for kerülni.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vásárlás',
      cancelButtonText: 'Mégse'
    }).then((result) => {
      if (result.isConfirmed) {
          this.eventService.publishEvent(Events.showLoading);
         //mentés a vásárlásokat tároló szerverre
         const pw = this.authService.getPassword();
         const timestamp = Date.now().toString();
         this.purchaseService.savePurchase(this.username, pw, this.name, this.price, timestamp)
         .subscribe(response => {
            this.eventService.publishEvent(Events.hideLoading);
            Swal.fire({
              icon: 'success',
              title: 'Siker',
              text: 'Mostantól egy ' + this.name + ' tulajdonosa vagy. A vásárlási előzményeidet megnézheted az előzmények menüben'
            });
         }, error => {
            this.eventService.publishEvent(Events.hideLoading);
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Sikertelen vásárlás!',
              text: error.error.message
            });
         });
         
      }
    });
  }

}
