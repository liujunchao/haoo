import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
import { HomePage } from '../home/home';
import { PaymentSuccessPage } from '../paymentSuccess/paymentSuccess';
import { OrderPage } from '../order/order';
@Component({
  templateUrl: 'payment.html',
  providers: [HttpUtil, MyToastController]
})
export class PaymentPage {
  from: string
  address_id: string
  grand_total: string
  products_list: any[]
  order_id: string
  constructor(private toastCtrl: MyToastController, public navCtrl: NavController, private navParams: NavParams, private httpUtil: HttpUtil) {
    this.from = this.navParams.data.from;
    this.address_id = this.navParams.data.address_id;
    this.grand_total = this.navParams.data.grand_total;
    if (this.from === "rebuy") {
      this.products_list = this.navParams.data.products_list;
      this.order_id = this.navParams.data.order_id;
    } else if (this.from === "unpayOrder") {
      this.order_id = this.navParams.data.order_id;
    }
  }
  close() {
    this.navCtrl.pop();
  }
  chooseWechat() {
    this.createOrder("wxpay");
  }
  chooseAlipay() {
    this.createOrder("alipay_direct");
  }
  createOrder(method: string) {
    // if(method === "alipay_direct" && window["alipay"] === undefined){
    //   this.toastCtrl.toast("支付宝插件未就绪，请联系客服", false);
    //   return ;
    // }
    // if (this.from === "unpayOrder") {
    //   this.alipay();
    //  // this.toastCtrl.toast("支付接口待完善", false);
    //   return;
    // }
    if (this.from === "rebuy") {
      this.httpUtil.rebuyCheckout(this.order_id, method, this.address_id, this.products_list).then((res) => {
        this.alipay(res.result, method);
      });
      return;
    }
    if (this.from === "unpayOrder") {
      this.httpUtil.payOrder(method, this.order_id).then((res) => {
        if (res.result && res.result.alipay_order_string) {
          this.alipay(res.result, method);
        }
      });
      return;
    }
    if (this.from != "" && this.address_id != "") {
      this.httpUtil.createOrder(method, this.address_id, this.from).then((res) => {
        if (res.result) {
          this.alipay(res.result, method);
        }
      });
    }
  }

  returnOrder(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(OrderPage);
  }

  alipay(result, type) {
    //  this.navCtrl.setRoot(PaymentSuccessPage,{json:{
    //      total_amount:10,
    //      trade_no:'fdsfsdfsfs',  
    //      timestamp:'2017-4-16 10:20:10',
    //      method:'alipay_direct',

    //  }}); 
    //     var rlt  = {total_amount:10};
    //  this.navCtrl.setRoot(PaymentSuccessPage,{json:rlt}); 
    if (type === 'alipay_direct') {
      window["alipay"].pay({

        alipay_order_string: result.alipay_order_string,
      }, (successResults) => {
        //  alert(JSON.stringify(successResults));
        var json = successResults.alipay_trade_app_pay_response;
        // alert(JSON.stringify(json))
        json.method = type;
        this.navCtrl.setRoot(PaymentSuccessPage, { json: json });
      }, (errorResults) => {
        alert(JSON.stringify(errorResults));
        this.returnOrder();
      });
    } else {
      //alert(JSON.stringify(result) + window["wechat"]+ window["Wechat"]);
      // var params = {
      //   appid:result.appid,
      //   partnerid: result.partnerid, // merchant id
      //   prepayid: result.prepayid, // prepay id returned from server
      //   noncestr: result.noncestr, // nonce string returned from server
      //   timestamp: result.timestamp, // timestamp
      //   sign: result.sign, // signed string
      //   package:result.package
      // };
      var me  = this; 
      window["Wechat"].sendPaymentRequest(result, function (rlt) {
       me.navCtrl.setRoot(PaymentSuccessPage, { json: {
         total_amount:me.grand_total,
         method:type
       }});
      }, function (reason) {
        alert("Failed: " + reason);
         this.returnOrder();
      });
    }


  }
} 
