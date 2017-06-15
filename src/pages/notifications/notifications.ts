import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil';
import { NotificationDetailPage } from '../notificationDetail/notificationDetail';

export class Notifcation{
  title:string
}
@Component({
  templateUrl: 'notifications.html',
  providers:[HttpUtil],
})
export class NotificationsPage { 
  newCount:number = 0;
  deliveryCount:number =0;
  returnCount:number = 0;
  refundCount:number = 0;
  constructor(private httpUtil:HttpUtil,public navCtrl: NavController) {
    this.httpUtil.getUnreadTotalByGroup().then((res)=>{
      this.newCount = res.result.new;
      this.deliveryCount = res.result.delivery;
      this.returnCount = res.result.return;
      this.refundCount = res.result.refund;
    })
  }
  transferView(type){
    this.navCtrl.push(NotificationDetailPage,{
      type:type
    });
  }
}
