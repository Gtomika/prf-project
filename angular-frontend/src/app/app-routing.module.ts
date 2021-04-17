import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about/about.component';
import { ErrorComponent } from './error/error/error.component';
import { HomepageComponent } from './homepage/homepage/homepage.component';
import { LoginComponent } from './login/login/login.component';
import { ProductsComponent } from './products/products/products.component';
import { RegisterComponent } from './register/register/register.component';

const routes: Routes = [
  //a root URL a login-ra irányít
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  //egyéb útvonalak
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'about', component: AboutComponent},
  //wildcard a hibás URL-ek elfogására
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
