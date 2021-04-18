import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products/products.component';
import { HomepageComponent } from './homepage/homepage/homepage.component';
import { ErrorComponent } from './error/error/error.component';
import { AboutComponent } from './about/about/about.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { EventBrokerModule } from 'ng-event-broker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductsComponent,
    HomepageComponent,
    ErrorComponent,
    AboutComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EventBrokerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
