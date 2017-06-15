 

import { Component, ViewChild, ElementRef,OnInit,EventEmitter } from '@angular/core';

import { InfiniteScroll, NavParams,NavController,PopoverController,ViewController } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil';
 
// import { PopoverPage } from '../home/PopoverDetailPage';
import { SavePage } from '../save/save';
import  {MyToastController} from '../../components/myToast'
import { ProductDetailPanel } from '../../components/productDetailPanel';
import { FixedPipe } from '../../pipes/fixedPipe';
import { FileDownService } from '../../service/filedown';
import { ProductPage } from '../product/product';

@Component({ 
  template:`  
    <div class="productsFilter"> 
    <input type="number" class="form-control"  [(ngModel)]="minPrice" placeholder="最低价"/>
    <span>-</span>
    <input type="number"  class="form-control"    [(ngModel)]="maxPrice" placeholder="最高价"/>  
    
    </div>
    <div class="productsFilterButtons"><button ion-button color="light" (click)="cancel()">取消</button> 
    <button ion-button  (click)="confirm()">确定</button></div>
  `
 
})
export class FilterControl { 
  minPrice:number 
  maxPrice:number
  static priceFilterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(  private viewController:ViewController) { }
  cancel(){
    this.viewController.dismiss();
  }
  confirm(){
    var price  = {
      min:this.minPrice,
      max:this.maxPrice
    };
    if(isNaN(this.minPrice)){
      delete price.min;
    }
    if(isNaN(this.maxPrice)){
      delete price.max;
    }
    this.cancel();
    FilterControl.priceFilterChange.emit(price);
  }
}
 
@Component({
  templateUrl: 'categoryProducts.html',
  providers:[HttpUtil,MyToastController],
 // directives:[ProductDetailPanel],
  // pipes:[FixedPipe]
})
export class CategoryProductPage implements OnInit{  
  @ViewChild(InfiniteScroll) scroll:InfiniteScroll
  @ViewChild(ProductDetailPanel) detailPanel: ProductDetailPanel;

  category:any
  cartList:any = []
  searchContent:string
  isCategory:boolean
  totalCount:number = 0
  pageIndex:number = 1
  products_total:number
  quantity_total:number
  range:any
  constructor(private viewController:ViewController,private popoverCtrl: PopoverController, public navCtrl: NavController,private params:NavParams ,private httpUtil:HttpUtil,private navController:NavController,private popoverController:PopoverController,private toastCtrl: MyToastController) { 
    this.isCategory = this.params.data.isCategory;
    if(this.isCategory){
      this.category = this.params.data.category;
    }else{
      this.searchContent = this.params.data.searchContent;
    }
  }
  ngOnInit(){ 
      this.getData();
      ProductDetailPanel.cartAdded.subscribe((result)=>{
        this.updateTotal(result);
      });
    FilterControl.priceFilterChange.observers=[];
      FilterControl.priceFilterChange.subscribe((range)=>{
        this.range = range;
        this.search();
      });
  }
  ionViewWillEnter(){
      this.httpUtil.getSelectedCartInfo().then((res)=>{ 
        this.updateTotal(res.result);
      });
   }
  updateTotal(result){
     this.products_total = result.products_total;
      this.quantity_total = result.quantity_total;
  }
  getData(){
    
    if(this.isCategory){
      let condition  = {
            cid: this.category.cid,
            index: this.pageIndex,
            rows: 10
        };
     if(this.range){
        if(this.range.min){
          condition["lprice"] = this.range.min;
        }
        if(this.range.max){
          condition["hprice"] = this.range.max;
        }
      }
      this.httpUtil.getProductsByCategory(condition).then((res)=>{
        this.cartList = this.cartList.concat(res.result) ;
        if(res.result.length<10){
          this.scroll.complete();
          this.scroll.enable(false);
        }else{
          this.pageIndex++;
        }
      });
    }else{
      //lprice hprice
      let condition = {
        keyword:this.searchContent,
        index:this.pageIndex
      };
      if(this.range){
        if(this.range.min){
          condition["lprice"] = this.range.min;
        }
        if(this.range.max){
          condition["hprice"] = this.range.max;
        }
      }
      this.httpUtil.search(condition).then((res)=>{
        this.cartList = this.cartList.concat(res.result.data) ;
        this.totalCount = res.result.total;
        this.pageIndex++;
        if(this.totalCount <= this.cartList.length){ 
          this.scroll.complete();
          this.scroll.enable(false);
        }
      });
    }
  }
 
  doInfinite(infiniteScroll){ 
    this.getData(); 
  }

  search(){
   
    this.scroll.enable(true);
    this.pageIndex=1; 
    this.cartList = [];
   // this.isCategory = false; 
    this.getData();
  }
  
  goSearch(){
     this.isCategory = false; 
     this.range = undefined;
    this.search(); 
  }

  addToCart(cart){ 
    this.detailPanel.showCart(cart,this.toastCtrl); 
  }

  leave(){
    this.navController.pop();
  }

  showFilterDlg(evt){
    let dlg = this.popoverController.create(FilterControl);
    dlg.present({
      ev:evt
    });
  }
   goSavePage(){ 
     this.navController.push(SavePage); 
   }

   downloadImage(url) {
    FileDownService.download(url);
  }
  gotoProductDetail(cart) {
    //pass condition
    this.navCtrl.push(ProductPage, cart);
  }
}
