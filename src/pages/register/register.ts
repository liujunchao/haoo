import { Component,OnInit  } from '@angular/core';
import { NavController,NavParams ,LoadingController,AlertController } from 'ionic-angular';  
import { HomePage } from '../home/home';
import { HttpUtil } from '../../service/httpUtil'; 
 import { AjaxService } from '../../service/ajax'; 

@Component({
  templateUrl: 'register.html' ,
   providers:[AjaxService],
})
export class RegisterPage implements OnInit{ 

  type:string
  password:string
  confirmPassword:string
  email:string 
  constructor(public navCtrl: NavController,private navParams: NavParams,private util:AjaxService,private alertCtrl:AlertController) {}
  register(){ 
    //   if(!/^.*@.*\..*$/.test(this.email)){
    //        this.util.showErrors("错误","邮箱格式有误");
    //        return ;
    //   }
      if(this.password !== this.confirmPassword){ 
           var dlg = this.alertCtrl.create({
              title: "错误",
              message: "输入密码与确认密码不相等"
          });
          dlg.present();
          return ;
      }
      
      this.util.commonPost("haooapi/register",{
          email:this.email,
          password:this.password
      },(msg)=>{
         var dlg = this.alertCtrl.create({
              title: "失败",
              message: msg
          });
          dlg.present();
      },()=>{}).then(()=>{
          this.navCtrl.setRoot(HomePage,{});
      });
  }
  login(){
      this.navCtrl.pop();
  }
  ngOnInit(): void {
      this.type = "buyer";
  }
}
