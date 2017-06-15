import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { CartQtyComponent } from '../../components/cartQty';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
import { SavePage } from '../save/save';
import { LoginPage } from '../login/login';
import { FixedPipe } from '../../pipes/fixedPipe';
import { FileDownService } from '../../service/filedown';
  
@Component({
  templateUrl: 'product.html',
  ///directives: [CartQtyComponent],
  providers: [HttpUtil, MyToastController],
  // pipes:[FixedPipe]
})
export class ProductPage implements OnInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  cart: any
  picIndex: number
  currentPicture: string
  banners: any[] = []
  constructor(private toastCtrl: MyToastController, public navCtrl: NavController, private navParams: NavParams, private httpUtil: HttpUtil) {
    this.cart = navParams.data;
  }
  gotoNotificationPage() {
    this.navCtrl.push(NotificationsPage);
  }
  ngOnInit(): void {
    var pid = this.cart.pid;
    this.httpUtil.getProduct(pid).then((rlt) => {
      this.cart = rlt.result;
      this.cart.pid = pid;
      this.cart.description = this.cart.description.replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
      this.banners = this.cart.images;
      this.cart.quantity = 1;
      let htmlElement = document.createElement("div");
      htmlElement.innerHTML = this.cart.description;
      this.content.nativeElement.appendChild(htmlElement);
      setTimeout(() => {
        var swiper = new window["Swiper"](".product-swiper-container", {
          pagination: '.product-swiper-pagination',
          paginationClickable: true,
          spaceBetween: 0,
          centeredSlides: true,
          autoplay: 2500,
          autoplayDisableOnInteraction: false,
          loop: true
        });
      }, 0);
      this.setDefaultSelection();
    });
    this.picIndex = 1;

  }
  payment() {
    let selectedOptionValues = [];
      if(this.cart.options.length){
    for (let option of this.cart.options) {
      let isOptionSelected = false;
      for (let value of option.option_values) {
        if (value.isSelected === true) {
          isOptionSelected = true;
          selectedOptionValues.push({ option_id: option.option_id, option_value_id: value.option_value_id });
        }
      }
      if (!isOptionSelected) {
        this.toastCtrl.toast("请选择属性" + option.option_name, true);
        return;
      }
    }
    if (selectedOptionValues.length === 0) {
      this.toastCtrl.toast("该商品没有属性，无法购买", true);
      return;
    }}
    if (this.cart.quantity > 0) {
      this.httpUtil.addToSelectedCart({
        pid: this.cart.pid,
        quantity: this.cart.quantity,
        options: selectedOptionValues
      }).then(() => {
        if (this.httpUtil.isLogin()) {
          this.navCtrl.push(SavePage);
        } else {
          this.navCtrl.push(LoginPage);
        }
      });
    } else {
      this.toastCtrl.toast("数量不能为0", true);
    }
  }

  addToCarts() {
    let selectedOptionValues = [];
    if(this.cart.options.length){
      for (let option of this.cart.options) {
          let isOptionSelected = false;
          for (let value of option.option_values) {
            if (value.isSelected === true) {
              isOptionSelected = true;
              selectedOptionValues.push({ option_id: option.option_id, option_value_id: value.option_value_id });
            }
          }
          if (!isOptionSelected) {
            this.toastCtrl.toast("请选择属性" + option.option_name, true);
            return;
          }
        }
        if (selectedOptionValues.length === 0) {
          this.toastCtrl.toast("该商品没有属性，无法购买", true);
          return;
        }
    }
  
    if (this.cart.quantity > 0) {
      this.httpUtil.addToCart({
        pid: this.cart.pid,
        quantity: this.cart.quantity,
        options: selectedOptionValues
      }).then(() => {
        this.toastCtrl.toast("已添加到购物车", false);
      });
    } else {
      this.toastCtrl.toast("数量不能为0", true);
    }

  }

  getGrandTotal() {
    var amount = parseFloat(this.cart.price) * parseFloat(this.cart.quantity);
    if (isNaN(amount)) {
      return "0";
    } else {
      return amount.toFixed(2);
    }
  }

   isCartOptionsSelected() {
        let selectedOptionValues = [];
        if (this.cart.options) {
            for (let option of this.cart.options) {
                let isOptionSelected = false;
                for (let value of option.option_values) {
                    if (value.isSelected === true) {
                        isOptionSelected = true;
                        selectedOptionValues.push({ option_id: option.option_id, option_value_id: value.option_value_id });
                    }
                }
                if (!isOptionSelected) {
                    return [false, []];
                }
            }
            return [true, selectedOptionValues];
        }
        return [false, []];
    }


  selectProperty(property, selectedOptionValue) {
    for (let optionValue of property.option_values) {
      if (selectedOptionValue.option_value_id != optionValue.option_value_id) {
        optionValue.isSelected = false;
      }
    }
    if (selectedOptionValue.isSelected === undefined) {
      selectedOptionValue.isSelected = false;
    }
    selectedOptionValue.isSelected = !selectedOptionValue.isSelected;
     this.refreshPrice();
  }

   refreshPrice(){
        let [isOptionSelected, selectedOptionValues] = this.isCartOptionsSelected(); 
        if(isOptionSelected === true && selectedOptionValues["length"]){
            this.httpUtil.getProductPrice(this.cart.pid,this.cart.quantity,selectedOptionValues).then((res)=>{
                this.cart.price = res.result.final_price;
            });
        }
    }

   setDefaultSelection(){
        for(let property of this.cart.options){
            if(property.option_values.length){
                property.option_values[0].isSelected = true;
            }
        }
        this.refreshPrice();
    }

  downloadImage(url) {
    FileDownService.download(url);
  }
} 
