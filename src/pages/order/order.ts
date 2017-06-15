import { Component,OnInit } from '@angular/core';
import { NavController ,ModalController,AlertController} from 'ionic-angular';
 
import { CartPage } from '../cart/cart';  
import {CartInfo} from '../../service/CartInfo';
//import {Order} from '../../service/Order';
// import { PaidOrDeliveryPage } from '../paidOrDelivery/paidOrDelivery';
import { CustomerServicePage } from '../CustomerService/CustomerService';
import { HttpUtil } from '../../service/httpUtil';
import { SavePage } from '../save/save';  
import { PaymentPage } from '../payment/payment';
import { OrderDetailPage } from '../orderDetail/orderDetail';
import { FixedPipe } from '../../pipes/fixedPipe';
import { OrderReturnPage } from '../orderReturn/orderReturn';
@Component({
  templateUrl: 'order.html',
   providers: [HttpUtil],
  // pipes:[FixedPipe]
})
export class OrderPage implements OnInit{
  orders:any = [] 
  orderType:string
  orderTypes:any = []
  selectedType:string
  pageIndexes:any = {}
  ordersDic:any = {}
  constructor(private httpUtil:HttpUtil,public navCtrl: NavController,public modalCtrl: ModalController,public alertCtrl:AlertController) {
  
 }
  payment(order){
     //this.navCtrl.push(OrderDetailPage,order);
     this.navCtrl.push(PaymentPage,{
       order_id:order.order_id,
       grand_total:order.grand_total,
       from:"unpayOrder"
     }); 
  } 
  purchaseAgain(order){ 
     this.navCtrl.push(SavePage,{from:"rebuy",order_id:order.order_id});
  } 
  transferView(order){
    //已申请退货、已退款、已发货、异常订单
    if(order.order_type === "6"||order.order_type === "4"||order.order_type === "5" ){ 
      this.navCtrl.push(OrderDetailPage,{
        order_id:order.order_id
      });
    }else if(order.order_type === "9"){
      this.navCtrl.push(OrderReturnPage,{
        order_id:order.order_id,
        readOnly:true 
      });      
    }
  }
  cancelOrder(order){
    if(order.order_type == "1"){
      let confirm = this.alertCtrl.create({
      title: '取消订单?',
      message: '确认是否取消订单?',
      buttons: [
        {
          text: '是',
          handler: () => {
           this.httpUtil.cancelOrder(order.order_id).then(()=>{
            this.getOrdersByType("all");
          });
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
    }else{
       this.httpUtil.cancelOrder(order.order_id).then(()=>{
            this.getOrdersByType("all");
        });
    }
   
  }
  contactClientService(order){
      this.navCtrl.push(CustomerServicePage,order);
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
    this.orderTypes = [
      {desc:"所有",value:"all"},
      {desc:"未付款",value:"1"}, //付款，取消订单，再购买。
      {desc:"已付款",value:"2"}, //取消交易，再购买。
      {desc:"已发货",value:"4"}, //显示物流信息，申请退货（退货/换货/补价），再购买
      {desc:"异常订单",value:"5"},//联系客服
      {desc:"退款/退货",value:"unusual"}
    ] ;
    this.orderType = "all";
    this.getOrdersByType(this.orderTypes[0]);
  } 
  getOrdersByType(item){ 
    var value  = item.value;
    this.selectedType = value;
    // if(this.ordersDic[value]){
    //   this.orders = this.ordersDic[value];
    //   return this.orders;
    // }
    this.httpUtil.getOrderList(value,1).then((res)=>{
        this.orders = res.result;
        this.ordersDic[value] = res.result;
        if(res.result.length<10){
          item.noData = true;
        }
    }); 
  }

  showOrderTypeLoading(orderType){  
     return orderType.value === this.selectedType&& orderType.noData !== true;
  }
  doInfinite(myScroll,item) {
    console.log("invoke:"+item.desc);
    if(this.pageIndexes[item.value] === undefined){
      this.pageIndexes[item.value] = 2;
    }
    var index = this.pageIndexes[item.value];
    this.httpUtil.getOrderList(item.value,index).then((res)=>{
       var prev =  this.ordersDic[item.value];
       if(prev === undefined){
         prev = [];
       }
        var newResult = prev.concat(res.result);
        this.ordersDic[item.value] = newResult;
        this.orders = newResult;
        index++;
        this.pageIndexes[item.value] = index;
        myScroll.complete();
        if(res.result.length<10){ 
          myScroll.enable(false);
          item.noData = true;
        } 
    });   
  }
}
