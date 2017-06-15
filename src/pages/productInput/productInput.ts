import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImgAddComponent } from '../../components/imgAdd';
import { BarcodeScanner } from 'ionic-native';
@Component({
  templateUrl: 'productInput.html',
 // directives:[ImgAddComponent]
})
export class ProductInputPage {
  isScan:boolean;
  barcode:string;
  constructor(public navCtrl: NavController) {
  }

  scan(){ 
    BarcodeScanner.scan().then((barcodeData) => { 
       this.isScan = true;
       this.barcode = barcodeData;
    }, (err) => {
        // An error occurred
    });
  }
}
