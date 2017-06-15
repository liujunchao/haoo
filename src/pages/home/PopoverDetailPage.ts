import { Component ,Output,EventEmitter} from '@angular/core';
import { NavController ,NavParams,PopoverController,ViewController} from 'ionic-angular';
import { ProductPage } from '../product/product';
import { HttpUtil } from '../../service/httpUtil';
import  {MyToastController} from '../../components/myToast'
import { CartQtyComponent } from '../../components/cartQty';
 import { FixedPipe } from '../../pipes/fixedPipe';
@Component({
  templateUrl: 'popup_cart_detail.html' , 
 // directives: [CartQtyComponent],
  providers: [HttpUtil],
//  pipes:[FixedPipe]
})
export class PopoverPage {
  cart:any;
  static cartAdded: EventEmitter<any> = new EventEmitter<any>();
  toastCtrl:MyToastController;
  viewProperties:Boolean;
  constructor(private navParams: NavParams,private httpUtil:HttpUtil,private viewCtrl: ViewController) {
    this.cart = this.navParams.data.cart; 
     
    this.toastCtrl  = this.navParams.data.toastController; 
    this.viewProperties = false;
  } 
  ngOnInit() { } 
 ionViewWillUnload(){
  
 }
  addToCart() { 
    if(this.cart.options == null){
      this.httpUtil.getProduct(this.cart.pid).then((rlt)=>{
        this.cart.options  = rlt.result.options; 
      }); 
    }
    if(this.viewProperties !==true){
      this.viewProperties = true;
      return ;
    }
    if(this.cart.quantity==0){
      this.toastCtrl.toast("数量不能为0",true);
      return ;
    }
     let selectedOptionValues = [];
     for(let option of this.cart.options){
       let isOptionSelected = false;
       for(let value of option.option_values){
         if(value.isSelected === true){
           isOptionSelected = true;
           selectedOptionValues.push({option_id:option.option_id,option_value_id:value.option_value_id});
         }
       }
       if(!isOptionSelected){
         this.toastCtrl.toast("请选择属性"+option.option_name,true);
         return ;
       }
     } 
     if(selectedOptionValues.length === 0){
       this.toastCtrl.toast("该商品没有属性，无法购买",true);
       return ;
      }
     this.httpUtil.addToSelectedCart({pid:this.cart.pid,quantity:this.cart.quantity,options:selectedOptionValues}).then((rlt)=>{
       if(rlt.status === 0){ 
          PopoverPage.cartAdded.emit(rlt.result);

          this.viewCtrl.dismiss().then(()=>{
            this.toastCtrl.toast("已添加",false); 
          });

       }
     }); 
  }
 
 
  selectProperty(property,selectedOptionValue){
    for(let optionValue of property.option_values){
      if(selectedOptionValue.option_value_id!= optionValue.option_value_id){
        optionValue.isSelected = false;
      }
    }
    if(selectedOptionValue.isSelected === undefined){
      selectedOptionValue.isSelected = false;
    }
    selectedOptionValue.isSelected = !selectedOptionValue.isSelected;
  }
}