import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService';
import { PaymentPage } from '../payment/payment';
import { HttpUtil } from '../../service/httpUtil';
import { OrderReturnPage } from '../orderReturn/orderReturn'; 
import { FixedPipe } from '../../pipes/fixedPipe';
@Component({
  templateUrl: 'orderDetail.html',
//  directives: [CartQtyComponent],
  providers: [HttpUtil],
 // pipes:[FixedPipe]
})
export class OrderDetailPage implements OnInit { 
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
  allSelected:boolean = false;
  isEditMode:boolean = false;
  saveResult:any 
  constructor(private httpUtil: HttpUtil, public navCtrl: NavController, public navParams: NavParams) {
    this.order_id = this.navParams.data["order_id"];
  }

  ngOnInit(): void {
    this.httpUtil.getOrderDetail(this.order_id).then((res) => {
      this.cartList = res.result.products_list;
      this.address = res.result.address;
      this.grand_total = res.result.grand_total;
      this.products_total = res.result.products_total;
      this.shipfee = res.result.shipfee;
      this.quantity_total = res.result.quantity_total;
      this.extension = res.result.extension;
      this.order_type_name= res.result.order_type_name;
      this.order_type = res.result.order_type;
      this.add_time = res.result.add_time;
      this.order_id = res.result.order_id; 
      if (this.cartList) {
        for (let cart of this.cartList) {
          cart.isSelected = false;
        }
      }
      this.saveResult = res.result;
    });
  }
 
  cancel() {
    this.httpUtil.cancelOrder(this.order_id).then(() => {
      this.navCtrl.pop();
    });

  }
  getCheckoutQty(){
    var len = 0;
    if (this.cartList) {
        for (let cart of this.cartList) {
          if(cart.isSelected){
            len++;
          }  
        }
    }
    return len;
  }
  checkedStateChange(){
    if (this.cartList) {
      for (let cart of this.cartList) {
        cart.isSelected = this.allSelected;
      }
    } 
  }
  setEditMode(){
    this.isEditMode = true;
  }
  applyReturn(){
    this.navCtrl.push(OrderReturnPage, {
      order:this.saveResult,
      readOnly:false 
    });
  }
}
