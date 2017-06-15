import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component'; 
//components and pipes
import { CartQtyComponent } from '../components/cartQty'; 
import { ProductDetailPanel } from '../components/productDetailPanel'; 
import { CartMenuComponent } from '../components/menu';
import { ImgAddComponent } from '../components/imgAdd';
import { ImgListComponent } from '../components/imgList';
import { IConComponent } from '../components/icon';
import { ImgShowComponent } from '../components/imgShow';
import { MyToastCmp } from '../components/myToast'; 
import { FixedPipe } from '../pipes/fixedPipe';  
//pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home'; 
import { AddressPage } from '../pages/address/address'; 
import { ApplyReturnGoodsPage } from '../pages/ApplyReturnGoods/ApplyReturnGoods';
import { ApplyReturnMoneyPage } from '../pages/ApplyReturnMoney/ApplyReturnMoney';
import { CartPage } from '../pages/cart/cart';
import { CategoryProductPage,FilterControl } from '../pages/categoryProducts/categoryProducts';
import { CustomerServicePage } from '../pages/CustomerService/CustomerService';
import { DeliveryInfoPage } from '../pages/deliveryInfo/deliveryInfo';
import { EditAddressPage } from '../pages/editAddress/editAddress';
import { EditLackedProductPage } from '../pages/editLackedProduct/editLackedProduct';
import { MyProductPage } from '../pages/myProduct/myProduct';
import { NotificationDetailPage } from '../pages/notificationDetail/notificationDetail';
import { NotificationsPage } from '../pages/notifications/notifications';
import { OrderPage } from '../pages/order/order';
import { OrderDetailPage } from '../pages/orderDetail/orderDetail';
//import { OrderDetailsPage } from '../pages/orderDetails/orderDetails';
import { OrderReturnPage } from '../pages/orderReturn/orderReturn';
import { PaymentPage } from '../pages/payment/payment';
import { PersonalInfoPage } from '../pages/personalInfo/personalInfo';
import { ProductPage } from '../pages/product/product';
import { ProductInputPage } from '../pages/productInput/productInput';
import { PurchaseListPage } from '../pages/purchaseList/purchaseList';
import { RegisterPage } from '../pages/register/register';
import { RetrivePasswordPage } from '../pages/retrivePassword/retrivePassword';
//import { ReturnPage } from '../pages/return/return';
import { ReturnDetailsPage } from '../pages/returnDetails/returnDetails';
import { ReturnGoodsPage } from '../pages/returnGoods/returnGoods';
import { SavePage } from '../pages/save/save';
import { PaymentSuccessPage } from '../pages/paymentSuccess/paymentSuccess'; 
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    OrderPage,
    AddressPage ,
    ApplyReturnGoodsPage ,
    ApplyReturnMoneyPage ,
    CartPage ,
    CategoryProductPage ,
    CustomerServicePage ,
    DeliveryInfoPage ,
    EditAddressPage ,
    NotificationDetailPage , 
    OrderPage ,
    OrderDetailPage ,
    //OrderDetailsPage ,
    OrderReturnPage ,
    PaymentPage ,
    PersonalInfoPage ,
    ProductPage ,
    ProductInputPage ,
    PurchaseListPage ,
    RegisterPage ,
    RetrivePasswordPage ,
   // ReturnPage ,
    ReturnDetailsPage ,
    ReturnGoodsPage ,
    SavePage ,
    CartQtyComponent,
    ProductDetailPanel,
    FixedPipe,
    CartMenuComponent,
    ImgAddComponent,
    ImgListComponent,
    ImgShowComponent,
    IConComponent,
    MyToastCmp,
    FilterControl,
    PaymentSuccessPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    OrderPage,
    AddressPage ,
    ApplyReturnGoodsPage ,
    ApplyReturnMoneyPage ,
    CartPage ,
    CategoryProductPage ,
    CustomerServicePage ,
    DeliveryInfoPage ,
    EditAddressPage ,
    NotificationDetailPage , 
    OrderPage ,
    OrderDetailPage ,
    SavePage,
    MyToastCmp,
    IConComponent,
    FilterControl,
    //OrderDetailsPage ,
    OrderReturnPage ,
    PaymentPage ,
    PersonalInfoPage ,
    ProductPage ,
    ProductInputPage ,
    PurchaseListPage ,
    RegisterPage ,
    RetrivePasswordPage,
    PaymentSuccessPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
