import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { PaymentPage } from '../payment/payment';
import { CartQtyComponent } from '../../components/cartQty';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
import { FixedPipe } from '../../pipes/fixedPipe';

@Component({
  templateUrl: 'save.html',
  // directives: [CartQtyComponent],
  providers: [HttpUtil, MyToastController],
  // pipes:[FixedPipe]
})
export class SavePage implements OnInit {
  cartList: any
  address: any
  grand_total: number
  products_total: number
  quantity_total: number
  shipfee: number
  source: string
  allSelected: boolean = true;//默认全选
  order_id: string
  constructor(private params: NavParams, private toastCtrl: MyToastController, private httpUtil: HttpUtil, public navCtrl: NavController, private alertController: AlertController) {
    this.source = params.data.from;
    if (this.source === "rebuy") {
      this.order_id = params.data.order_id;
    }
  }
  addressEdit() {
    this.navCtrl.push(AddressPage, this.address);
  }
  ngOnInit(): void {
    AddressPage.addressChange.subscribe((addr) => {
      this.address = addr;
    });

  }
  ionViewWillEnter() {
    this.fetchSelectedCarts();
  }
  getTotalAmount() {
    var sum = 0;
    if (this.cartList && this.cartList !== null) {
      for (let cart of this.cartList) {
        sum += cart.price * cart.quantity;
      }
    }
    return sum;
  }
  close() {
    this.navCtrl.pop();
  }
  fetchSelectedCarts() {
    var promise = null;

    if (this.source === "cart") {
      promise = this.httpUtil.checkout();
    } else if (this.source === "rebuy") {
      promise = this.httpUtil.rebuyOrder(this.order_id);
    } else {
      promise = this.httpUtil.getSelectedCarts();
    }
    promise.then((res) => {
      this.cartList = res.result.products_list;
      this.address = res.result.default_address || res.result.address;

      if (this.cartList) {
        for (let cart of this.cartList) {
          cart.isSelected = cart.selected == "1";
          if (this.source === "rebuy") {
            cart.isSelected = true;
          }
          //0表示下架了 
          if (cart.status === 0) {
            cart.isSelected = false;
          }
        }
      }
      this.totalValuesChanged(res.result);
    });

  }
  changeQuantity(result) {
    this.totalValuesChanged(result);
  }
  totalValuesChanged(result) {
    this.products_total = result.products_total;
    this.grand_total = result.grand_total;
    this.quantity_total = result.quantity_total;
    this.shipfee = result.shipfee;
  }
  payment() {
    if (this.grand_total === 0) {
      this.toastCtrl.toast("请添加商品", true);
      return;
    }
    if(this.address == null){
      this.toastCtrl.toast("请设置收货地址", true);
      return;
    }
    var data = {
      grand_total: this.grand_total,
      from: this.source == null ? "selected_cart" : this.source,
      address_id: this.address.address_id
    };
    if (this.source === "rebuy") {
      data["products_list"] = this.getSelectedCarts();
      data["order_id"] = this.order_id;
    }
    this.navCtrl.push(PaymentPage, data);
  }

  addToCarts() {
    var ids = [];
    for (let cart of this.cartList) {
      ids.push(cart.cart_id);
    }
    if (ids.length === 0) {
      this.toastCtrl.toast("没有商品可添加到购物车", true);
      return;
    }
    this.httpUtil.moveToCart(ids).then(() => {
      this.toastCtrl.toast("已添加到购物车", false);
    });
  }
  rebuyCaculateAmount() {
    var carts = this.getSelectedCarts();
    this.httpUtil.getProductsTotals({ products_list: carts }).then((res) => {
      this.totalValuesChanged(res.result);
    });
  }
  cartCheckedStateChange(cart) {
    setTimeout(() => {
      if (this.source === "rebuy") {
        setTimeout(() => {
          this.rebuyCaculateAmount();
        }, 0);
        return;
      }
      if (this.source === "cart") {
        this.httpUtil.selectCart(cart.isSelected, cart.cart_id).then((res) => {
          this.totalValuesChanged(res.result);
        });
        return;
      }
      console.log("isSelected:"+cart.isSelected);
      this.httpUtil.selectSelectedCart(cart.isSelected, cart.cart_id).then((res) => {
        this.totalValuesChanged(res.result);
      });
    }, 0);
  }
  checkedStateChange() { 
    if (this.cartList) {
      for (let cart of this.cartList) {
        cart.isSelected = this.allSelected && cart.status !== 0;
      }
    }
    if (this.source === "rebuy") {
      this.rebuyCaculateAmount();
    } else {
      this.httpUtil.selected_cart_selectAll(this.allSelected).then((res) => {
        this.totalValuesChanged(res.result);
      });
    }
  }

  getSelectedCarts() {
    var carts = [];
    if (this.cartList) {
      for (let cart of this.cartList) {
        if (cart.isSelected) {
          carts.push({ pid: cart.product_id, quantity: cart.quantity, options: cart.options });
        }
      }
    }
    return carts;
  }
  deleteSelectedCart(cart) {
    let confirm = this.alertController.create({
      message: '确认删除吗？',
      buttons: [
        {
          text: '确定',
          handler: () => {
            confirm.dismiss();
            var rtnResult: Promise<any> = null;
            if (this.source === "cart") {
              rtnResult = this.httpUtil.deleteCart(cart.cart_id);
            } else {
              rtnResult = this.httpUtil.deleteSelectedCart(cart.cart_id);
            }
            rtnResult.then((res) => {
              if (res.status === 0) {
                this.httpUtil.notify("成功", "删除成功");
                var idx = this.cartList.indexOf(cart);
                this.cartList.splice(idx, 1);
                this.totalValuesChanged(res.result);
              }
            });
          }

        },
        {
          text: "取消",
          role: "cancel"
        }
      ]
    });
    confirm.present();
  }
}
