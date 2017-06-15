import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { CartQtyComponent } from '../../components/cartQty';
import { SavePage } from '../save/save';
import { HttpUtil } from '../../service/httpUtil';
import { LoginPage } from '../login/login';
import  {MyToastController} from '../../components/myToast'
import { FixedPipe } from '../../pipes/fixedPipe';
@Component({
  templateUrl: 'cart.html',
//  directives: [CartQtyComponent],
  providers: [HttpUtil,MyToastController],
 // pipes:[FixedPipe]
})
export class CartPage implements OnInit {
  cartList: any
  source: string 
  products_total: number
  quantity_total: number
  shipfee:number
  grand_total:number
  allSelected:boolean = true;//默认全选
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private navParams: NavParams, private httpUtil: HttpUtil, private alertController: AlertController,private toastCtrl:MyToastController) { }
  addressEdit() {
    this.navCtrl.push(AddressPage);
  } 
  ngOnInit(): void {
  
  }
  ionViewWillEnter() {
   this.httpUtil.getProductListInCart().then((res) => {
      this.cartList = res.result.products_list;
      this.products_total = res.result.products_total;
      this.quantity_total = res.result.quantity_total;
      if (this.cartList) {
        for (let cart of this.cartList) {
          cart.isSelected = cart.selected=="1";
        }
      }
    });
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

  checkout() {
    var qty  = this.getCheckoutQty();
    if(qty === 0){
      this.toastCtrl.toast("请勾选商品",true);
      return ;
    }
     if(this.httpUtil.isLogin()){
       this.navCtrl.push(SavePage,{
         from:"cart"
       });
     }else{
       this.navCtrl.push(LoginPage,{});
     }
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
  close() {
    this.navCtrl.pop();
  }
  checkedStateChange(){
    if (this.cartList) {
      for (let cart of this.cartList) {
        cart.isSelected = this.allSelected;
      }
    }
    this.httpUtil.cart_selectAll(this.allSelected).then((res)=>{
      this.totalValuesChanged(res.result);
    });
  }
  changeQuantity(result){
    this.totalValuesChanged(result);
  }
  totalValuesChanged(result){
     this.products_total = result.products_total;
      this.grand_total = result.grand_total;
      this.quantity_total = result.quantity_total;
      this.shipfee = result.shipfee;
  }
  cartCheckedStateChange(cart){ 
    setTimeout(()=>{
      this.httpUtil.selectCart(cart.isSelected,cart.cart_id).then((res)=>{
        this.totalValuesChanged(res.result); 
      });
    },0);
  }
  deleteCart(cart) { 
    let confirm = this.alertController.create({
      message: '确认删除吗？',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.httpUtil.deleteCart(cart.cart_id).then((res) => {
              if (res.status === 0) {
                this.httpUtil.notify("成功", "删除成功");
                var idx = this.cartList.indexOf(cart);
                this.cartList.splice(idx,1);
                this.totalValuesChanged(res.result);
              }
            });
          }
          
        },
        {
          text:"取消",
          role:"cancel"
        }
      ]
    });
    confirm.present();
  }

}
