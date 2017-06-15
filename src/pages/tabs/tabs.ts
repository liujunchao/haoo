import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { CartPage } from '../cart/cart';
import { OrderPage } from '../order/order';
import { ReturnPage } from '../return/return';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;
  public tab4Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = CartPage;
    this.tab3Root = OrderPage;
    this.tab4Root = ReturnPage;
  }
}
