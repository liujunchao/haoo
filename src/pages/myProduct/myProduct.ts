import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { ProductPage } from '../product/product';
import { ProductInputPage } from '../productInput/productInput';
import { CartService } from '../../service/cartService';
import { SavePage } from '../save/save';
import { ImgShowComponent } from '../../components/imgShow';

@Component({
  templateUrl: 'myProduct.html',
  //directives: [ImgShowComponent],
  providers: [CartService]
})
export class MyProductPage implements OnInit {
  constructor(private cartService: CartService, public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  cartList: any
  categories: any
  selected: string
  gotoNotificationPage() {
    this.navCtrl.push(NotificationsPage);
  }
  gotoProductDetail(cart) {
    //pass condition
    this.navCtrl.push(ProductPage, cart);
  }
  ngOnInit(): void {
    this.cartService.getCarts().then(rlt => this.cartList = rlt);
    var cate = ["家居", "厨具", "食品", "服装", "家居2", "厨具2", "食品2", "服装2", "家居3", "厨具3", "食品3", "服装3"];
    this.categories = [];
    for (let itm of cate) {
      this.categories.push({ name: itm });
    }
    this.selected = "家居2";
  }

  gotSavePage() {
    let profileModal = this.modalCtrl.create(SavePage, { userId: 8675309 });
    profileModal.present();
  }
  changeCategory(item) {
    this.selected = item.name;
  }
  edit() {
    this.navCtrl.push(ProductInputPage, {});
  }
  changeSalesStatus(cart) {
    cart.badge === "停售"?cart.badge = "":cart.badge = "停售";
  }
}
