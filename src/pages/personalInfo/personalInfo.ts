import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil'; 
@Component({
  templateUrl: 'personalInfo.html',
  providers: [HttpUtil]
})
export class PersonalInfoPage implements OnInit {
  user:any = {}
  constructor(private params: NavParams, public navCtrl: NavController,  private httpUtil: HttpUtil) {
    
    
  } 
  ngOnInit() { 
  } 
  save() {
    this.httpUtil.saveCustomer(this.user).then((rlt)=>{
      alert("保存成功");
    });
 
  }
}
