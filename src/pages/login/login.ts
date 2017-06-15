import { Component,OnInit,EventEmitter,ViewChild,ElementRef } from '@angular/core';
//import { NgForm  } from '@angular/common';

import { NavController,NavParams ,AlertController } from 'ionic-angular'; 
import { HomePage } from '../home/home'; 
 import { AjaxService } from '../../service/ajax'; 
import { RegisterPage } from '../register/register'; 
import { RetrivePasswordPage } from '../retrivePassword/retrivePassword'; 
@Component({
  templateUrl: 'login.html' ,
  providers:[AjaxService],
})
export class LoginPage implements OnInit{ 
  type:string 
  email:string
  password:string
  static loginSuccess:EventEmitter<any>  = new EventEmitter<any>();
 // @ViewChild('loginForm') public loginForm: NgForm;

  constructor(private alertCtrl:AlertController,public navCtrl: NavController,private navParams: NavParams,private util:AjaxService) {


  } 
  login(){
  
      return this.util.commonPost("haooapi/login", {
        email:this.email,
        password:this.password
      }, (msg) => { 
         var dlg = this.alertCtrl.create({
              title: "失败",
              message: msg
          });
          dlg.present();
       }, () => {}).then(()=>{
         localStorage.setItem("email",this.email);
         LoginPage.loginSuccess.emit({
           email:this.email
         });
         var len = this.navCtrl["_children"].length; 
         if(len){
            this.navCtrl.pop();
         }else{
           this.navCtrl.push(HomePage);
         } 
       });
  }
  ngOnInit(): void {
      this.type = "buyer";

      // setTimeout(()=>{
      //   this.loginForm.controls["email"].setErrors({
      //     required: "请输入"
      //   });
      // },1000);
  }
  register(){
      this.navCtrl.push(RegisterPage,{});
  }
  findPassword(){
    this.navCtrl.push(RetrivePasswordPage,{});
  }
} 
