import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService'; 
import { PaymentPage } from '../payment/payment';
import {Order} from '../../service/Order';
@Component({
  templateUrl: 'ApplyReturnMoney.html',
 //  directives: [CartQtyComponent],
  providers: [CartService]
})
export class ApplyReturnMoneyPage implements OnInit {
  cartList: any
  order: Order
  constructor(private cartService: CartService, public navCtrl: NavController, public modalCtrl: ModalController, private navParams: NavParams) {
    this.order = navParams.data;
  }
  ngOnInit(): void {
    this.cartService.getCarts().then(rlt => this.cartList = rlt);
  }

  submit() { 

  }
  getTotalAmount() {
    var sum = 0;
    if (this.cartList && this.cartList !== null) {
      for (let cart of this.cartList) {
        sum += cart.price;
      }
    }
    return sum;
  }

  pay() {
    let profileModal = this.modalCtrl.create(PaymentPage, {});
    profileModal.present();
  }
  close() {
    this.navCtrl.pop();
  }
}
