import { Component,OnInit } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';  
 import { AjaxService } from '../../service/ajax'; 
import  {MyToastController} from '../../components/myToast'
@Component({
  templateUrl: 'retrivePassword.html' ,
  providers:[MyToastController,AjaxService],
})
export class RetrivePasswordPage implements OnInit{  
  email:string 
  constructor(private util:AjaxService,private toastCtrl:MyToastController,public navCtrl: NavController,private navParams: NavParams,private alertCtrl:AlertController) { } 
 
  ngOnInit(): void {
      
  } 
  findPassword(){ 
      this.util.commonPost("haooapi/forget",{
          email:this.email, 
      },(msg)=>{
         var dlg = this.alertCtrl.create({
              title: "失败",
              message: msg
          });
          dlg.present();
      },()=>{}).then(()=>{
          let ctrl =  this.toastCtrl.create({
            message:"新密码已发送至您的邮箱",
            showSuccessIcon:true,
            position:"middle",
            duration:1000
          });
          ctrl.present();
      });
    //showSuccessIcon  showErrorIcon

  } 
} 
