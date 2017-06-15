import { Component,OnInit } from '@angular/core';
import { NavController,ModalController,NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService';
import { PaymentPage } from '../payment/payment';
import {CartInfo} from '../../service/CartInfo';
import {Order} from '../../service/Order'; 
import { ReturnGoodsPage } from '../returnGoods/returnGoods'; 
@Component({
  templateUrl: 'ApplyReturnGoods.html'  
})
export class ApplyReturnGoodsPage implements OnInit{
 
  order:Order; 
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,private navParams: NavParams) {
    this.order = navParams.data; 
  } 
    ngOnInit(): void { 
      
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
    showReturnGoodsPage(order){
      this.navCtrl.push(ReturnGoodsPage,order);
    }
}
