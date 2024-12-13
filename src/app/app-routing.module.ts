import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopFormComponent } from './Shop/shop-form/shop-form.component';
import { HomePComponent } from './home-p/home-p.component';
import { ProductDetailsComponent } from './Product/product-details/product-details.component';
import { LoginComponent } from './login/login.component';
import { ShopComponent } from './Shop/shop_page/shop.component';
import { UserShopComponent } from './Shop/user-shop/user-shop.component';
import { AddProductComponent } from './Product/add-product/add-product.component';
import { RegisterComponent } from './register/register.component';
import { EditProdComponent } from './Product/edit-prod/edit-prod.component';
import { VisitShopComponent } from './Shop/visit-shop/visit-shop.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'RegisterShop', component: ShopFormComponent },
  { path: 'home', component: HomePComponent },
  { path: 'Item/:pid', component: ProductDetailsComponent},
  { path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'MyShop', component: UserShopComponent},
  { path: 'addItem', component: AddProductComponent},
  { path: 'editProduct/:pid', component: EditProdComponent},
  { path: 'Shop/:sid', component: VisitShopComponent},
  { path: '**', component: HomePComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
