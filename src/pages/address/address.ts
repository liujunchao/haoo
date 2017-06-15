import { Component,OnInit,EventEmitter,ViewChild } from '@angular/core';
import { NavController,AlertController,NavParams,InfiniteScroll } from 'ionic-angular';
import { EditAddressPage } from '../editAddress/editAddress';
import { HttpUtil } from '../../service/httpUtil';
import { MyToastController } from '../../components/myToast'
@Component({
  templateUrl: 'address.html',
  providers:[HttpUtil,MyToastController]
})
export class AddressPage implements OnInit{
  @ViewChild(InfiniteScroll) scroll:InfiniteScroll;
  constructor(private toastController: MyToastController,private params:NavParams,public navCtrl: NavController,public alertCtrl:AlertController,private httpUtil:HttpUtil) {
    if(params.data!=null){
      this.addressChosen = params.data;
    }
       

  }
  searchContent: string;
  pageIndex:number = 1;
  addressList:any = [];
  isEditMode :boolean = false;
  isNothing :boolean = false;
  addressChosen:any = {}
   static addressChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void { }
  ionViewWillEnter(){
    this.refreshAddressList();
  }
  refreshAddressList(){
     let condition  = {
            keyword:this.searchContent,
            index: this.pageIndex,
            rows: 10
        };
    this.httpUtil.getAddresses(condition).then((res)=>{
      this.addressList =  res.result;
        if(res.result.length<10){
          this.scroll.complete();
          this.scroll.enable(false);
        }else{
          this.pageIndex++;
        }
    });
  }
  edit(addr){
    this.navCtrl.push(EditAddressPage,addr);
  }
  remove(addr){
   let confirm = this.alertCtrl.create({
      title: '删除地址?',
      message: '确认要删除地址吗?',
      buttons: [
        {
          text: '是',  
          handler: () => {
            this.httpUtil.deleteAddress(addr.address_id).then((res)=>{
              if(res.status === 0){
                this.refreshAddressList();
                confirm.dismiss();
                 this.isNothing = false;
              }
            });
          }
        },
        {
          text: '否',
          handler: () => {
            confirm.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }
  newAddress(){
    this.navCtrl.push(EditAddressPage); 
  }
  changeDefault(addr){
    if(addr.default == 0){
      this.httpUtil.setDefaultAddress(addr.address_id).then((res)=>{ 
        this.refreshAddressList(); 
      });
    } 
  }
  toggleEditModel(){
    this.isEditMode = !this.isEditMode;
    this.isNothing = false;
  }
  chooseAddress(addr){
    if(this.isEditMode === false){
      this.addressChosen = addr;
      AddressPage.addressChange.emit(addr);
      this.navCtrl.pop();
    }
  }
 
   goSearch() {
    this.pageIndex=1; 
    // this.addressList = [];
     this.scroll.enable(true);
    this.refreshAddressList();
    this.isNothing = true;
    this.isEditMode = false;
  };
   doInfinite(infiniteScroll){ 
    this.refreshAddressList(); 
  }
}
