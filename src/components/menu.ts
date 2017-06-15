import { Component,OnInit } from '@angular/core';
import { NavController,ModalController,MenuController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { CartPage } from '../pages/cart/cart';
import { OrderPage } from '../pages/order/order';
import { ReturnPage } from '../pages/return/return';
import { LoginPage } from '../pages/login/login';
import { PersonalInfoPage } from '../pages/personalInfo/personalInfo';
@Component({
  selector: 'cart-menu',
  styles : [`
        ion-content,ion-list{
            background-color: #373d4d;
            color:white;
        }
        ul{
            margin-top:4rem;
            margin-left:2rem;
            list-style:none;
        }
        li{
            font-size:2rem;
            border-bottom:solid 1px #dce2e6;
            height:4.5rem;
            display: flex;
            align-items: center;
        }
        ion-icon,svg{
            margin:1rem;
        }
        svg{
            font-size:1.2rem;
        }
        green{
            color:green;
        }
  `],
  template:`
     <ion-menu [content]="content">
     
        <ion-content>
            <ul>
                <li  *ngIf="isLogin" class="green"   (click)="toPage(5)"> 
                  <svg class="icon" aria-hidden="true"  *ngIf="isLogin" > <use xlink:href="#icon-avatar" ></use> </svg>
                  <svg class="icon" aria-hidden="true"  *ngIf="!isLogin" > <use xlink:href="#icon-avatar2" ></use> </svg>
                    <span>{{user}}</span> 
                </li> 
                <li (click)="logout()"  *ngIf="!isLogin">
                    <svg class="icon" aria-hidden="true"  > <use xlink:href="#icon-home" ></use> </svg>
                    <span>登陆</span> 
                </li>       
                 <li (click)="toPage(2)">
                 <svg class="icon" aria-hidden="true"  > <use xlink:href="#icon-cart1" ></use> </svg>
                    <span>购物车</span> 
                </li>
                <li (click)="toPage(3)"  *ngIf="isLogin">
                     <svg class="icon" aria-hidden="true"  > <use xlink:href="#icon-order" ></use> </svg>
                    <span>我的订单</span> 
                </li> 
                <li (click)="logout()" *ngIf="isLogin">
                    <svg class="icon" aria-hidden="true"  > <use xlink:href="#icon-shut_out" ></use> </svg>
                    <span>退出帐户</span> 
                </li> 

            </ul>
        </ion-content>
    </ion-menu>
<ion-nav id="nav" #content [root]="rootPage"></ion-nav>

  `
})
export class CartMenuComponent implements OnInit{
  user:string
 isLogin:boolean = false;
 constructor( public navCtrl: NavController,public modalCtrl: ModalController,public menuCtrl:MenuController ) {
   this.user = localStorage.getItem("email");
   this.checkIsLogin();
 } 
 checkIsLogin(){
    this.isLogin = localStorage.getItem("token") !=null;
 }
  
    toPage(key):void{
        this.menuCtrl.close(); 
        switch(key){
            case 1:
                this.navCtrl.push(HomePage);
                break;
            case 2:
                this.navCtrl.push(CartPage);
                break;
            case 3:
                this.navCtrl.push(OrderPage);
                break;
            case 4:
                this.navCtrl.push(ReturnPage);
                break;
            case 5:
                this.navCtrl.push(PersonalInfoPage);
        } 
    } 
    logout(){
       localStorage.removeItem("token"); 
       localStorage.removeItem("email"); 
       this.user = "";
       this.isLogin = false;
       this.navCtrl.push(LoginPage);
    }
    ngOnInit(): void {
        LoginPage.loginSuccess.subscribe((info)=>{
            this.user = info.email;
            this.checkIsLogin();
        });
    }
}
