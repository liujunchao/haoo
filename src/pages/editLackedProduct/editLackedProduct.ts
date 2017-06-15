import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'editLackedProduct.html'
})
export class EditLackedProductPage {
  constructor(public navCtrl: NavController) {
  }
  close(){
     this.navCtrl.pop();
  }
  confirm(){
    console.log("confirm");
  }
}
