import { Component, Input, OnInit } from '@angular/core';
import { error } from 'selenium-webdriver';
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

  username: string;

  //ez kerül mutatásra, ha a kép betöltődött
  imageToShow: any;

  //jelzi, hogy betöltött-e a kép
  imageLoaded: boolean;

  constructor(private productService: ProductService) { 
    this.imageLoaded = false;
    const localUsername = localStorage.getItem('username');
    if(localUsername) {
      this.username = localUsername;
    } else {
      this.username = '';
    }
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
         //TODO: mentés
         Swal.fire({
            icon: 'success',
            title: 'Siker',
            text: 'Mostantól egy ' + this.name + ' tulajdonosa vagy. A vásárlási előzményeidet megnézheted az előzmények menüben'
         });
      }
    });
  }

}
