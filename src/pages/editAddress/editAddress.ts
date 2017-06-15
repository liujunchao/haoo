import { Component, OnInit } from '@angular/core';
import { NavController, PickerController, Picker, NavParams } from 'ionic-angular';
import { HttpUtil } from '../../service/httpUtil';
import { ImgAddComponent } from '../../components/imgAdd';
@Component({
  templateUrl: 'editAddress.html',
  providers: [HttpUtil],
//  directives: [ImgAddComponent]
})
export class EditAddressPage implements OnInit {
  constructor(private params: NavParams, public navCtrl: NavController, private pickerController: PickerController, private httpUtil: HttpUtil) {
    var addressInfo = this.params.data;
    if (addressInfo.address_id) {
      this.addressId = addressInfo.address_id;
      this.httpUtil.getAddressInfo(this.addressId).then((res) => {
        let addr = res.result;
        this.location = {
          zone: {
            text: addr.zone,
            value: addr.zone_id
          },
          city: {
            text: addr.city,
            value: addr.city_id
          },
          district: {
            text: addr.district,
            value: addr.district_id
          }
        },
          this.name = addr.name;
        this.phone = addr.phone;
        this.address = addr.address;
        this.identity = addr.identity;
        this.imgNegative.url = addr.back_image;
        this.imgPositive.url = addr.front_image;
        this.default = addr.default;
      });
    }
  }
   addressId: string
   location: any = null
  name: string
  address: string
  identity: string
  phone: string
  imgPositive: any = { url: "" }
  imgNegative: any = { url: "" }
   
  default: number = 0
  ngOnInit() {
    this.location = {
      zone:{},
      city:{},
      district:{}
    };
  }
  getZones(fn: Function) {
    this.httpUtil.getZones().then((rlt) => {
      var zones = rlt.result;
      var dataList = [];
      for (let zone of zones) {
        dataList.push({ text: zone.zone_name, value: zone.zone_id });
      }
      fn(dataList);
    });
  }
  getDistricts() {
    let cityId  = this.location.city.value;
    if(cityId== null || cityId =="") return ;
    this.httpUtil.getDistricts(cityId).then((rlt) => {
      var districts = rlt.result;
      var dataList = []; 
      for (let district of districts) {
        dataList.push({ text: district.district_name, value: district.district_id }); 
       
      }
      let ctrl = this.pickerController.create({
        columns: [
          {
            options: dataList,
            name: "district",
            selectedIndex: 0
          }
        ],
        buttons: [
          {
            text: "取消",
            role: 'cancel',
            handler: () => {
              ctrl.dismiss();
            }
          },
          {
            text: "确定",
            handler: (data: any) => {
              console.log(data);
             this.location.district.value = data.district.value;
               this.location.district.text = data.district.text;
            }
          }
        ]
      });
      ctrl.present();
    });
  }
  getCities() {
    let zoneValue  = this.location.zone.value;
    if(zoneValue== null || zoneValue =="") return ;
    this.httpUtil.getCities(zoneValue).then((rlt) => {
      var cities = rlt.result;
      let values = []; 
      for (let city of cities) {
        values.push({ text: city.city_name, value: city.city_id }); 
      }
      let ctrl = this.pickerController.create({
        columns: [
          {
            options: values,
            name: "city",
            selectedIndex: 0
          }
        ],
        buttons: [
          {
            text: "取消",
            role: 'cancel',
            handler: () => {
              ctrl.dismiss();
            }
          },
          {
            text: "确定",
            handler: (data: any) => {
              console.log(data);
             this.location.city.value = data.city.value;
               this.location.city.text = data.city.text;
               this.location.district={};
            }
          }
        ]
      });
      ctrl.present();
    });
  }

  getProvinces() {
    this.getZones((zones) => {
      let ctrl = this.pickerController.create({
        columns: [
          {
            options: zones,
            name: "zone",
            selectedIndex: 0
          }
        ],
        buttons: [
          {
            text: "取消",
            role: 'cancel',
            handler: () => {
              ctrl.dismiss();
            }
          },
          {
            text: "确定",
            handler: (data: any) => { 
               this.location.zone.value = data.zone.value;
               this.location.zone.text = data.zone.text;
               this.location.city={};
               this.location.district={};
            }
          }
        ]
      });
      ctrl.present();
    });

  }
  isNetworkAddress(src: string) {
    if (src == null || src == "") {
      return false;
    }
    if (src.startsWith("//") || src.startsWith("http://") || src.startsWith("https://")) {
      return true;
    }
    return false;
  }
  save() {
    if (this.name == "") {
      this.httpUtil.notify("保存失败", "请填写收件人姓名");
      return;
    }
    if (this.phone == "") {
      this.httpUtil.notify("保存失败", "请填写收件人电话");
      return;
    }
    if (this.address == "") {
      this.httpUtil.notify("保存失败", "请填写详细地址");
      return;
    }
    if (this.location == null) {
      this.httpUtil.notify("保存失败", "请选择省市区");
      return;
    }

    let requestObj = {
      name: this.name,
      phone: this.phone,
      address: this.address,
      identity: this.identity,
      zone_id: this.location.zone.value,
      city_id: this.location.city.value,
      district_id: this.location.district.value,
      back_image: this.imgNegative.url,
      front_image: this.imgPositive.url,
      default: this.default
    };
    if (this.isNetworkAddress(requestObj.back_image)) {
      delete requestObj.back_image;
    }
    if (this.isNetworkAddress(requestObj.front_image)) {
      delete requestObj.front_image;
    }
    var promise = null;
    if (this.addressId != null) {
      requestObj["address_id"] = this.addressId;
      promise = this.httpUtil.editAddress(requestObj);
    } else {
      promise = this.httpUtil.addAddress(requestObj);
    }
    promise.then((rlt) => {
      if (rlt.status === 0) {
        //  let dlg = this.httpUtil.notify("保存成功","保存成功");
        //  dlg.dismiss().then(()=>{

        //  });
        this.navCtrl.pop();
      }
    });
  }
}
