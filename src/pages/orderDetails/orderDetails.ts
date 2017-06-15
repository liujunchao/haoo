import { Component,OnInit } from '@angular/core';
import { NavController ,ModalController,AlertController,NavParams} from 'ionic-angular';
import { EditLackedProductPage } from '../editLackedProduct/editLackedProduct';
import { CartPage } from '../cart/cart'; 
import {OrderService} from '../../service/OrderService';
import {CartInfo} from '../../service/CartInfo';
import {Order} from '../../service/Order';
import { DeliveryInfoPage } from '../deliveryInfo/deliveryInfo';

import { EditAddressPage } from '../editAddress/editAddress';
import { ImgShowComponent } from '../../components/imgShow';
@Component({
  templateUrl: 'orderDetails.html',
  //directives:[ImgShowComponent],
   providers: [OrderService]
})
export class OrderDetailsPage implements OnInit{
  orders:Order[];
  orderType:string;
  itemKey:string;
  constructor(private service:OrderService,public navCtrl: NavController,public modalCtrl: ModalController,public alertCtrl:AlertController,private params:NavParams) {
    this.itemKey = params.get("itemKey");
  }
  lack(){
     let profileModal = this.modalCtrl.create(EditLackedProductPage,{});
     profileModal.present(); 
  }  
  remove(){
   let confirm = this.alertCtrl.create({
      title: '删除地址?',
      message: '确认要删除地址吗?',
      buttons: [
        {
          text: '是',
          handler: () => {
            console.log('Yes clicked');
          }
        },
        {
          text: '否',
          handler: () => {
            console.log('No clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  ngOnInit(): void { 
    this.orderType = "all";
      this.service.getOrders().then(rlt=>{
         this.orders = [];
        for(let order of rlt){
          order.onlyShowMainItem  =true;
          var contains = false;
          for(let itm of order.items){
            this.setOrderStatusDesc(itm);
            if(itm.title === this.itemKey){
              contains= true;
              break;
            }
          }
          if(contains  ){
            
            this.orders.push(order);
          }
        }
      });
  }
  purchase(order:Order){
    return ;
   // order.bStatus = order.bStatus === "notSettle"?"settle":"notSettle";
   //  this.setOrderStatusDesc(order);
  }
  showDelivery(){
    this.navCtrl.push(DeliveryInfoPage,{});
  }
  expandMore(order:Order){
    order.onlyShowMainItem = false;
  }
  hideMore(order:Order){
    order.onlyShowMainItem = true;
  }
  canCombineDelivery(order:Order){
    if(order.items.length === 1 || order.onlyShowMainItem) return false;
     for(let itm of order.items){
       if(itm.bStatus !== "settle"){
         return false;
       }
     }
    return true;
  }
  setOrderStatusDesc(itm:CartInfo){
    
    switch(itm.bStatus){
      case "notSettle":
        itm.badge = "未采";
        break;
      case "shortage":
        itm.badge = "缺货";
        break;
      case "unpaid":
        itm.badge = "未付";
        break;
      case "delivery":
        itm.badge = "已发";
        break;
      case "purchase":
        itm.badge = "已结";
        break; 
      case "settle":
         itm.badge = "已采";
        break; 

    }
  }

    isOrderMatch(order:Order){
     for(let itm of order.items){
         if(itm.bStatus === this.orderType && itm.title === this.itemKey){
           return true;
         }
     }
     return false;
  }
  getItems(order:Order){
    if(!order.onlyShowMainItem) return order.items;
     for(let itm of order.items){
          if(itm.title === this.itemKey){
            return [itm];
          }
     }
     return [];
  }

  canShowShortage(order:Order){
     for(let itm of order.items){
          if(itm.title === this.itemKey && itm.bStatus === 'shortage'){
            return true;
          }
     }
     return false;
     
  }

}
