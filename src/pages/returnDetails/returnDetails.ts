import { Component,OnInit } from '@angular/core';
import { NavController,ModalController,NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService';
import { PaymentPage } from '../payment/payment';
import {CartInfo} from '../../service/CartInfo';
import {Order} from '../../service/Order';

@Component({
  templateUrl: 'returnDetails.html' 
})
export class ReturnDetailsPage implements OnInit{
 
  order:Order
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,private navParams: NavParams) {
    this.order = navParams.data; 
  } 
    ngOnInit(): void { 
          //this.cartService.getCarts().then(rlt=>this.cartList = rlt);
    }
    getTotalAmount(){
      var sum =0;
      if(this.order.items&& this.order.items!==null){ 
        for(let cart of this.order.items){
          sum += cart.price;
        } 
      }
      return sum ;
    } 
    close(){
     this.navCtrl.pop();
    }
}
