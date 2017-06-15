import { Component, Input, OnInit, EventEmitter, Output, ViewChild, ElementRef,trigger,style,transition,animate,state } from '@angular/core';
import { HttpUtil } from '../service/httpUtil';
import { MyToastController } from './myToast'
import { CartQtyComponent } from './cartQty';
import { FixedPipe } from '../pipes/fixedPipe';
@Component({
    selector: 'product-detail',
    //directives:[CartQtyComponent],
    providers: [HttpUtil],
//     animations:[
//     //在position状态改变时，触发动画
//     trigger('position',[
//       //position为left时的样式
//       state('left',style({
//         'margin-left': 0,
//         'background-color':'yellow'
//       })),
//       //position为right时的样式
//       state('right',style({
//         'margin-left': 200,
//         'background-color':'blue'
//       })),
//       //状态切换时的动画设置
//       transition('left => right',animate('1000ms ease-in')),
//       transition('right => left',animate('1000ms ease-out'))
//     ])
//   ],
    //  pipes:[FixedPipe],
    template: `
    <div class="my-backdrop" (click)="_bdClick()"   [hidden]="!showDialog"></div>
       <div  [hidden]="!showDialog"  class="product-detail" #productDetailContainer>
        <div class="popup-product-detail">
            <svg class="icon" aria-hidden="true"  (click)="_bdClick()">
                <use xlink:href="#icon-cross"></use>
            </svg>
            <div class="detail">
                <img src="{{cart.image}}" /> <span class="price">{{cart.price|fixed}}</span>
            </div>
            <div class="qty">
                <span>数量</span>
                <cart-qty [qty]="cart" (focusEvent)="cartFocus($event)" (blurEvent)="cartBlur($event)" ></cart-qty>
            </div>
            <div class="property-panel property-panel-limit" *ngIf=" cart.options!=null &&cart.options.length">
                <div *ngFor="let property of cart.options">
                    <div class="property-title">{{property.option_name}}</div>
                    <div class="property-choose" *ngFor="let optionValue of property.option_values" [ngClass]="{'property-selected': optionValue.isSelected}" (click)="selectProperty(property,optionValue)">
                        {{optionValue.option_value_name}}
                    </div>
                </div>
            </div>
            <!--
            <div class="property-panel" *ngIf="  (cart.options==null ||cart.options.length === 0)">
                <span class="warning">暂无属性，无法购买</span>
            </div>-->
            <div class="add" (click)="addToCart()">
                添加
            </div>
        </div>
       </div>
  `,
    styles: [` 
    .product-detail{
        position:absolute;
        z-index:10;  
        background-color:white;
        color:black;
        border-radius:10px;
        width:95%;
        max-height: 50rem;
        overflow-y: scroll; 

    }
    .my-backdrop{
        opacity:0.08;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: block;
        width: 100%;
        height: 100%;
        background-color: #000; 
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-transition: all 0.3s;
	-moz-transition: all 0.3s;
	transition: all 0.3s;
    	-webkit-transform: translateX(-50%) translateY(-50%);
	-moz-transform: translateX(-50%) translateY(-50%);
	-ms-transform: translateX(-50%) translateY(-50%);
	transform: translateX(-50%) translateY(-50%);
    }
    .warning{
        display:block;
        font-size:1.5rem;
        margin-top:1rem;
        margin-bottom:1rem;
        color:#c51a2e;
    }
    svg{
        position: absolute; 
        right: 1rem;
        top: 0.6rem;
    }
    .property-panel-limit{
        max-height:20rem;
        overflow-y:scroll;
    }
  `]
})
export class ProductDetailPanel implements OnInit {
    @ViewChild('productDetailContainer', { read: ElementRef }) productDetailContainer: ElementRef;
    showDialog: Boolean = false;
    qtyForBackup: any;
    operation: string
    cart: any;
    @Input()
    toastCtrl: MyToastController;
    static cartAdded: EventEmitter<any> = new EventEmitter<any>();
    @Input() set setOperation(operation: string) {
        this.operation = operation;
    }
    @Output() qtyChange: EventEmitter<any> = new EventEmitter<any>();
    constructor(private httpUtil: HttpUtil) { }
    ngOnInit(): void {
        this.cart = {
            image: "",
            price: 0,
            quantity: 0,
            options: []
        };
    }
    showCart(cart: any, toastCtrl: MyToastController) {
        this.showDialog = true;
        this.cart = cart;
        this.cart.quantity = 1;
        this.toastCtrl = toastCtrl;
        this.resizeComponent();
        if (this.cart.options == null) {
            this.httpUtil.getProduct(this.cart.pid).then((rlt) => {
                this.cart.options = rlt.result.options;
                if (this.cart.options.length > 0) {
                    this.resizeComponent();
                }
                this.setDefaultSelection();
            });
        }
    }
    _bdClick() {
        this.showDialog = !this.showDialog;
    }
    cartFocus($event) {
        var element = this.productDetailContainer.nativeElement;
        var pos = parseFloat((element.style.top + "").replace("px", ""));
        element.style.top = (pos - 100) + "px";;
        console.log("focus:" + new Date() + " afterChange:" + element.style.top);
    }
    cartBlur($event) {
        var element = this.productDetailContainer.nativeElement;
        var pos = parseFloat((element.style.top + "").replace("px", ""));
        element.style.top = (pos + 100) + "px";
        console.log("blur:" + new Date() + " afterChange:" + element.style.top);
    }

    resizeComponent() {
        setTimeout(() => {
            var element = this.productDetailContainer.nativeElement;
            var top = ((screen.availHeight - 100) / 2) - (element.clientHeight / 2);
            var left = (screen.width / 2) - (element.clientWidth / 2);
            element.style.top = top + 'px';
            element.style.left = left + 'px';
        }, 100);
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

    addToCart() {
        if (this.cart.quantity == 0) {
            this.toastCtrl.toast("数量不能为0", true);
            return;
        }
        let [isOptionSelected, selectedOptionValues] = this.isCartOptionsSelected(); 
        if (this.cart.options && selectedOptionValues) {
             if (!isOptionSelected) {
                    this.toastCtrl.toast("请选择属性", true);
                    return;
                }
        }
 
        this.httpUtil.addToSelectedCart({ pid: this.cart.pid, quantity: this.cart.quantity, options: selectedOptionValues }).then((rlt) => {
            if (rlt.status === 0) {
                ProductDetailPanel.cartAdded.emit(rlt.result);
                if(this.cart.selected_quantity){
                    this.cart.selected_quantity = parseInt(this.cart.selected_quantity)+1;
                }else{
                    this.cart.selected_quantity=1;
                }
                this.toastCtrl.toast("已添加", false);
                this.showDialog = false;
            }
        });
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
}
