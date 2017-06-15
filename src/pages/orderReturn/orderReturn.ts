import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService';
import { PaymentPage } from '../payment/payment';
import { HttpUtil } from '../../service/httpUtil';
import { ImgListComponent } from '../../components/imgList';
import  {MyToastController} from '../../components/myToast'
import { FixedPipe } from '../../pipes/fixedPipe';
@Component({
  templateUrl: 'orderReturn.html',
 // directives: [CartQtyComponent,ImgListComponent],
  providers: [HttpUtil,MyToastController],
 // pipes:[FixedPipe]
})
export class OrderReturnPage implements OnInit {
  cartList: any
  address: any  
  grand_total: number
  products_total: number
  quantity_total: number
  shipfee: number
  order_id: string
  order_type_name:string
  order_type:string 
  extension:any = {}
  add_time:string 
  reason:string
  note:string
  back_provider:string
  back_order:string
  imgList:any = {}
  readOnly:boolean = false;
  constructor(private toastController:MyToastController,private httpUtil: HttpUtil, public navCtrl: NavController, public navParams: NavParams) {
      this.readOnly = this.navParams.data.readOnly;
      if(this.readOnly === true){
        let order_id = this.navParams.data.order_id;
         this.httpUtil.getOrderDetail(order_id).then((res) => {
          this.initOrderInfo(res.result);
         });
      }else{
        let result = this.navParams.data.order;
        this.initOrderInfo(result);
      }
  }

  initOrderInfo(result){
      this.address =  result.address;
      this.grand_total =  result.grand_total;
      this.products_total =  result.products_total;
      this.shipfee =  result.shipfee;
      this.quantity_total =  result.quantity_total;
      this.extension =  result.extension;
      this.order_type_name=  result.order_type_name;
      this.order_type = result.order_type;
      this.add_time =  result.add_time;
      this.order_id = result.order_id;
      let list = [];
      for (let cart of result.products_list) {
          if(cart.isSelected === true&&!this.readOnly){
            list.push(cart);
          }else{
            list.push(cart);
          }
      }
      this.cartList = list;
      if(result.extension){
        if(result.extension.reason_images){
          this.imgList.list = [];
          for(let img of result.extension.reason_images){
            this.imgList.list.push({url:img});
          }
        }
        this.back_order = result.extension.back_order;
        this.back_provider = result.extension.back_provider;
        this.note = result.extension.note;
        this.reason = result.extension.reason;
      }
  }

  ngOnInit(): void { }
 
  getReturnTotalAmount(cart){
    var amount  = cart.return_money;
    if(isNaN(amount)|| isNaN(cart.quantity)){
      return "0";
    }
    
    return (parseFloat(amount) * parseInt(cart.quantity)).toFixed(2);
  }
  applyReturn(){
    var carts={ };
    for (let cart of this.cartList) {
       
      carts[cart.order_product_id] = { 
        quantity:cart.quantity,
        return_money:cart.return_money
      };
      if(cart.quantity === undefined || cart.return_money === undefined){
        this.toastController.toast("请填写数量以及金额",true);
        return ;
      }
    }
    
    var reason_images = [];
    for(let image of this.imgList.list){
      reason_images.push(image.url);
    }
    var obj  = {
      order_id:this.order_id,
      reason:this.reason,
      note:this.note,
      back_provider:this.back_provider,
      back_order:this.back_order,
      products_list:carts,
      reason_images:reason_images
    };
    this.httpUtil.returnOrder(obj).then(()=>{
      this.toastController.toast("提交成功",false);
      this.navCtrl.pop();
    });
  }
}
