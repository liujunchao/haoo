import { Component,OnInit } from '@angular/core';
import { NavController ,ModalController,AlertController,NavParams} from 'ionic-angular'; 
import { CartPage } from '../cart/cart'; 
import {OrderService} from '../../service/OrderService';
import {CartInfo} from '../../service/CartInfo';
import {Order} from '../../service/Order';
import { ReturnDetailsPage } from '../returnDetails/returnDetails'; 
import { ReturnGoodsPage } from '../returnGoods/returnGoods'; 

@Component({
  templateUrl: 'return.html',
  providers: [OrderService]
}) 
export class ReturnPage implements OnInit{
  type:string
  orders:Order[]
  constructor(private service:OrderService,public navCtrl: NavController,public modalCtrl: ModalController,public alertCtrl:AlertController,private param :NavParams) {
    this.type = param.get("type");
  }
  viewDetails(order){ 
    if(this.type === "goods"){
        this.navCtrl.push(ReturnGoodsPage,order);
    }else if(this.type === "money"){
      this.navCtrl.push(ReturnDetailsPage,order);
    }
     
  } 

  ngOnInit(): void { 
      this.service.getOrders().then(rlt=>this.orders = rlt);
  }

}