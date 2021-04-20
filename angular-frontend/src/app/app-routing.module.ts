import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { ErrorComponent } from './error/error.component';
import { AdminGuard } from './guards/admin.guard';
import { LoginGuard } from './guards/login.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  //a root URL a login-ra irányít
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  //egyéb útvonalak
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomepageComponent, canActivate: [LoginGuard]},
  {path: 'products', component: ProductsComponent, canActivate: [LoginGuard]},
  {path: 'about', component: AboutComponent, canActivate: [LoginGuard]},
  {path: 'user', component: UserComponent, canActivate: [LoginGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [LoginGuard, AdminGuard]},
  //wildcard a hibás URL-ek elfogására
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
