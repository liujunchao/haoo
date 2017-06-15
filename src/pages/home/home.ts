import { Component, OnInit, ElementRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { NavController, ModalController, NavParams, PopoverController, ToastController, ViewController, InfiniteScroll } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { ProductPage } from '../product/product';
import { CategoryProductPage } from '../categoryProducts/categoryProducts';
import { CartQtyComponent } from '../../components/cartQty';
import { CartService } from '../../service/cartService';
import { SavePage } from '../save/save';
import { CartMenuComponent } from '../../components/menu';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
// import { PopoverPage } from '../home/PopoverDetailPage';
import { FileDownService } from '../../service/filedown';
import { ProductDetailPanel } from '../../components/productDetailPanel';
import { CartPage } from '../cart/cart';
import { LoginPage } from '../login/login';
import { FixedPipe } from '../../pipes/fixedPipe';
import { Observable,Scheduler } from 'rxjs';

@Component({
  templateUrl: 'home.html',
  // directives: [ProductDetailPanel, CartMenuComponent],
  providers: [CartService, HttpUtil, MyToastController],
  //  pipes:[FixedPipe]
})
export class HomePage implements OnInit {
  @ViewChild('productContainer', { read: ElementRef }) productContainer: ElementRef;
  // @ViewChild('content', { read: ElementRef }) content: ElementRef;
  @ViewChild(ProductDetailPanel) detailPanel: ProductDetailPanel;
  @ViewChild('swiper', { read: ElementRef }) swiperContainer: ElementRef;
  constructor(private toastController: MyToastController, private cartService: CartService, public navCtrl: NavController, public modalCtrl: ModalController, private httpUtil: HttpUtil, private popoverCtrl: PopoverController) {

  }
  cartList: any
  categories: any
  selected: string
  banners: any
  picIndex: number
  currentPicture: string
  categoriesList: any
  cartsDic: any
  searchContent: string
  products_total: number;
  quantity_total: number
  showDialog: boolean = false
  countOfNotifications: number = 0;
  countOfCartTotal: number = 0
  pageIndexes: any = {}
  isLogin: boolean = false;
  gotoNotificationPage() {
    this.navCtrl.push(NotificationsPage);
  }
  gotoProductDetail(cart) {
    //pass condition
    this.navCtrl.push(ProductPage, cart);
  }
  toCartPage() {
    this.navCtrl.push(CartPage);
  }
  addToCart(cart) {
    //  let popover = this.popoverCtrl.create(PopoverPage, {
    //   cart:cart,
    //   toastController:this.toastController
    // });

    // popover.present();

    this.detailPanel.showCart(cart, this.toastController);
  }
  downloadImage(url) {
    FileDownService.download(url);
  }
  scrollContent($event) {
  //  console.log($event);
  }

  doInfinite(myScroll, item) {

 //   console.log("invoke:" + item.product_group_id);

    if (this.pageIndexes[item.product_group_id] === undefined) {
      this.pageIndexes[item.product_group_id] = 2;
    }
    // this.selected = item.name;
    if (item.product_group_id === "") return;
    // if (this.cartsDic[item.product_group_id]) {
    //   this.cartList = this.cartsDic[item.product_group_id];
    //   return this.cartsDic[item.product_group_id];
    // }
    var index = this.pageIndexes[item.product_group_id];
    this.httpUtil.getProducts(item.product_group_id, index).then((rlt) => {
      console.log("fetch:" + item.product_group_id + " index:" + index);
      var prev = this.cartsDic[item.product_group_id];
      if (prev === undefined) {
        prev = [];
      }
      var newResults = prev.concat(rlt.result);
      this.cartsDic[item.product_group_id] = newResults;
      this.cartList = newResults;
      index++;
      this.pageIndexes[item.product_group_id] = index;
      myScroll.complete();
      if (rlt.result.length < 10) {
        myScroll.enable(false);
        item.noData = true;
      }
    });
  }

  ngOnInit(): void {

    this.cartsDic = {};

    this.selected = "全部分类";

    var callback = (moudles, categories, banners) => {
      this.httpUtil.hideLoading(() => {
        this.categories = moudles.result;
        this.categories.unshift({
          name: "全部分类",
          product_group_id: ""
        });
        this.categoriesList = categories.result;
        var index = 0;
        for (let cate of this.categoriesList) {
          cate.index = index % 4;
          index++;
        }
        this.banners = banners.result;
        setTimeout(() => {
          //this.swiperContainer.nativeElement   not work
          var swiper = new window["Swiper"](".home-swiper-container", {
            pagination: '.home-swiper-pagination',
            paginationClickable: true,
            spaceBetween: 0,
            centeredSlides: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false,
            loop: true
          });

        }, 0);
      })
    };
    this.httpUtil.setLoading();
    this.httpUtil.when(callback, this.httpUtil.getModules(), this.httpUtil.getCategories(), this.httpUtil.getBanners());
    this.picIndex = 1;

    ProductDetailPanel.cartAdded.subscribe((result) => {
      this.updateTotal(result);
    });

    this.rxJsTest();


  }

rxJsTest(){ 
  
}

  ionViewWillEnter() {
    this.httpUtil.getSelectedCartInfo().then((res) => {
      this.updateTotal(res.result);
    });
    this.httpUtil.getCartQuantityTotal().then((res) => {
      this.countOfCartTotal = res.result.quantity_total;
    });
    this.isLogin = this.httpUtil.isLogin();
    if (this.isLogin) {
      this.httpUtil.getUnreadTotal().then((res) => {
        this.countOfNotifications = res.result.total;
      });
    }

  }
  updateTotal(result) {
    this.products_total = result.products_total;
    this.quantity_total = result.quantity_total;
  }
  
  linkProductOrCategory(item) {
    if (item.url_tag === "p") {
      this.navCtrl.push(ProductPage, {
        pid: item.url_tag_value
      });
    } else if (item.url_tag === "c") {
      this.navCtrl.push(CategoryProductPage, {
        category: {
          cid: item.url_tag_value
        },
        isCategory: true
      });
    }
  }
  gotSavePage() {
    if (this.httpUtil.isLogin()) {
      this.navCtrl.push(SavePage);
    } else {
      this.navCtrl.push(LoginPage);
    }

  }

  changeCategory(item) {
    this.selected = item.name;
    if (item.product_group_id === "") return;
    if (this.cartsDic[item.product_group_id]) {
      this.cartList = this.cartsDic[item.product_group_id];
      return this.cartsDic[item.product_group_id];
    }
    this.httpUtil.getProducts(item.product_group_id, 1).then((rlt) => {
      this.cartsDic[item.product_group_id] = rlt.result;
      this.cartList = rlt.result;
      if (rlt.result.length < 10) {
        item.noData = true;
      }
    //  console.log(`cateId:{product_group_id} load page 1`);
    });
  }

  showCategoryProducts(cate) { 
    this.navCtrl.push(CategoryProductPage, {
      category: cate,
      isCategory: true
    })
  }
  search() {
    if(this.searchContent==null || this.searchContent === ''){
      this.toastController.toast("请输入搜索关键词",true);
      return ;
      //请输入搜索关键词
    }
    this.navCtrl.push(CategoryProductPage, {
      searchContent: this.searchContent,
      isCategory: false
    });
  };

  showCategoryLoading(cate) {
    if ('全部分类' === this.selected) {
      return false;
    }
    return cate.name === this.selected && cate.noData !== true;
  }
}
