import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShopComponent } from './Shop/shop_page/shop.component';
import { CategoryFilterPipe } from './pipes/category_filterPipe';
import { SortingFilterPipe } from './pipes/sorting_filter_Pipe';
import { PriceRangeFilterPipe } from './pipes/price_filter_Pipe';
import { ProductDetailsComponent } from './Product/product-details/product-details.component';
import { ShopFormComponent } from './Shop/shop-form/shop-form.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePComponent } from './home-p/home-p.component';
import { LoginComponent } from './login/login.component';
import { UserShopComponent } from './Shop/user-shop/user-shop.component';
import { AddProductComponent } from './Product/add-product/add-product.component';
import { StepsIndicatorComponent } from './Shop/steps-indicator/steps-indicator.component';
import { WishlistPopupComponent } from './wishlist-popup/wishlist-popup.component';
import { RegisterComponent } from './register/register.component';
import { EditProdComponent } from './Product/edit-prod/edit-prod.component';
import { VisitShopComponent } from './Shop/visit-shop/visit-shop.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ShopComponent,
    CategoryFilterPipe,
    SortingFilterPipe,
    PriceRangeFilterPipe,
    ProductDetailsComponent,
    ShopFormComponent,
    HomePComponent,
    LoginComponent,
    UserShopComponent,
    AddProductComponent,
    StepsIndicatorComponent,
    WishlistPopupComponent,
    RegisterComponent,
    EditProdComponent,
    VisitShopComponent,
    PopupMessageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  exports: [PopupMessageComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
