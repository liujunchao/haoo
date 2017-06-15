import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
import { HomePage } from '../home/home'; 
import { OrderPage } from '../order/order';
@Component({
  templateUrl: 'paymentSuccess.html',
  providers: [HttpUtil, MyToastController] 
})
export class PaymentSuccessPage {
  json: any
  constructor(private toastCtrl: MyToastController, public navCtrl: NavController, private navParams: NavParams, private httpUtil: HttpUtil) {
    this.json = this.navParams.data.json; 
    //alert(JSON.stringify(this.json));
  }

  returnHome(){
    this.navCtrl.setRoot(HomePage);
  } 

  returnOrder(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(OrderPage);
  }
  
} 
