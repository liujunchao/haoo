import { Component, OnInit } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

import { HttpUtil } from '../../service/httpUtil';
import { FixedPipe } from '../../pipes/fixedPipe';
@Component({
  templateUrl: 'notificationDetail.html',
  providers: [HttpUtil],
 // pipes: [FixedPipe]
})
export class NotificationDetailPage implements OnInit {
  type:string
  products:any[] = []
  constructor(private params:NavParams ,private httpUtil: HttpUtil, public navCtrl: NavController) {
    this.type = params.data.type;
  }

  ngOnInit(): void {
    this.httpUtil.getNoticeListByGroup(this.type).then((res)=>{
      this.products = res.result;
    });
  }
}
