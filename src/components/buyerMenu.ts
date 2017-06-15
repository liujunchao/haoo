import { Component,OnInit } from '@angular/core';
import { NavController,ModalController,MenuController } from 'ionic-angular';
import { BuyerHomePage } from '../pages/buyerHome/buyerHome';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { MyProductPage} from '../pages/myProduct/myProduct';
import { ProductInputPage} from '../pages/productInput/productInput';
import { OrderPage } from '../pages/order/order';
import { PurchaseListPage } from '../pages/purchaseList/purchaseList';
import { LoginPage } from '../pages/login/login';
@Component({
  selector: 'cart-menu',
  template:`
     <ion-menu [content]="content" style="z-index:1000">
        <ion-toolbar>
            <ion-title>haoo 代购 <a class="pull-right" (click)="logout()">登出</a></ion-title>
        </ion-toolbar>
        <ion-content>
            <ion-list>
                <ion-item (click)="toPage(2)">
                    <h2>产品录入</h2>
                    <ion-icon name="create" item-left ></ion-icon>
                </ion-item>
                <ion-item (click)="toPage(3)">
                    <h2>我的产品</h2>
                    <ion-icon name="list-box" item-left></ion-icon>
                </ion-item>
                <ion-item (click)="toPage(4)">
                    <h2>采购清单</h2>
                    <ion-icon name="trash" item-left></ion-icon>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
<ion-nav id="nav" #content [root]="rootPage"></ion-nav>

  `
})
export class BuyerMenuComponent implements OnInit{

 constructor( public navCtrl: NavController,public modalCtrl: ModalController,public menuCtrl:MenuController ) {
   
  } 
  
    toPage(key):void{
        this.menuCtrl.close(); 
        switch(key){ 
            case 2:
                this.navCtrl.push(ProductInputPage);
                break;
            case 3:
                this.navCtrl.push(MyProductPage);
                break;
            case 4:
                this.navCtrl.push(PurchaseListPage);
                break;
        } 
    }
    ngOnInit(): void {}
    logout(){
        this.navCtrl.setRoot(LoginPage);
    }
}
