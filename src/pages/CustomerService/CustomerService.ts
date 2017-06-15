import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { NavController,NavParams  } from 'ionic-angular'; 
import { HttpUtil } from '../../service/httpUtil';
@Component({
  templateUrl: 'CustomerService.html' ,
  providers:[HttpUtil]
})
export class CustomerServicePage implements OnInit{
   @ViewChild('content', { read: ElementRef }) content: ElementRef;
  messages:any[] = []
  order_id:string
  msg:string = ""
  constructor(private params:NavParams,private httpUtil:HttpUtil,public navCtrl: NavController,private navParams: NavParams) {
     this.order_id = params.data.order_id;
  } 
  ngOnInit(){ 
    this.httpUtil.getOrderQuestion(this.order_id).then((res)=>{
      this.messages = res.result;
       this.scrollToBottom();
    }); 
   
  }

  scrollToBottom(){
      setTimeout(()=>{
              this.content.nativeElement.scrollTop = 200;
              var scrollContent = this.content.nativeElement.children[1];
              scrollContent.scrollTop =scrollContent.scrollHeight;
      },0);
  }

  submit(){
    if(this.msg === "") return ;
    this.httpUtil.submitQuestion(this.order_id,this.msg).then((res)=>{

      var dt = new Date();
      var dtStr = dt.getFullYear()+"-"+dt.getMonth()+"-"+(dt.getDate()+1)+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
      var newMsg = {
        role:2,
        msg:this.msg,
        add_date:dtStr
      }
      this.messages.push(newMsg);
      this.msg = "";
     this.scrollToBottom();
    });
  }
 
} 
