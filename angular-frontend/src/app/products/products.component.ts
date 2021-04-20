import { Component, OnInit } from '@angular/core';
import { EventBrokerService } from 'ng-event-broker';
import { Events } from 'src/app/events.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private eventService: EventBrokerService) { }

  ngOnInit(): void {
      //töltés amíg a termékek nem töltődnek be
      setTimeout(() => {
          //később kell kezdődnie, vagy "Expression has changed after it was checked" hiba
          this.eventService.publishEvent(Events.showLoading);
      }, 10);

      //TODO: termékek betöltése
  }

}
