import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpUtil } from '../service/httpUtil';

@Component({
    selector: 'cart-qty',
    providers: [HttpUtil],
    template: `
       <div class="count_quantity">
            <a class="count_reduce"  (click)="decrease()"><ion-icon name="ios-remove" ></ion-icon></a>
            <a class="count_add"  (click)="increase()"><ion-icon name="ios-add" ></ion-icon></a> 
            <input  type="number" value="1" class="buy-num" name="quantity"  [(ngModel)]="qty.quantity" (change)="turnFormat()" (focus)="selectAll($event)" (blur)="blurInvoke($event)" /> 
      </div>
  `,
    styles: [`
            ion-input input{
                    margin: 0;
                padding: 0;
                text-align: center;
            }
             .count_quantity{
                    height: 2.9rem;
                    line-height: 2.9rem;
                    overflow: hidden;
                    border-radius: 0.1rem;
                    border:1px solid #dce1e5; 
                    width:10rem;
                }
              .count_quantity  .buy-num{ 
                    border-width:0;
                  float: left;
                        width: 3.8rem;
                        text-align: center;
                        color:#000;
                        padding:0;
                        border-left: 1px solid #dce1e5;
                        border-right: 1px solid #dce1e5;  
                        height: 100%;
                    }
               .count_quantity  a{
                        width:3rem;
                        min-width: 0;
                        border:none;
                        padding:0;
                        margin-right: 0;  
                        text-align:center;
                    }
               .count_quantity .count_add{ 
                            float: right;
                 }
                   .count_quantity .count_reduce{ 
                            float: left;
                 }
  `]
})
export class CartQtyComponent implements OnInit {
    @Input()
    qty: any;
    qtyForBackup: any;
    operation: string
    @Input() set setOperation(operation: string) {
        this.operation = operation;
    }
    @Output() qtyChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor(private httpUtil: HttpUtil) { }
    increase() {
        if (this.qty.status === 0) {
            return;
        }
        this.checkValue();
        this.qty.quantity = this.qty.quantity + 1;
        this.addToCart();
    }
    decrease() {
        if (this.qty.status === 0) {
            return;
        }
        this.checkValue();
        if (this.qty.quantity > 1) {
            this.qty.quantity = this.qty.quantity - 1;
            this.addToCart();
        }
    }
    checkValue() {
        if (this.qty.quantity === undefined) {
            this.qty.quantity = 1;
        }
    }
    turnFormat() {
        this.checkValue();
        //status为0表示已下架，则不允许修改数量
        if (this.qty.status === 0) {
            this.qty.quantity = this.qtyForBackup;
            return;
        }
        try {
            this.qty.quantity = parseInt(this.qty.quantity);
            if (isNaN(this.qty.quantity) || this.qty.quantity == "0") {
                this.qty.quantity = this.qtyForBackup;
            } else {
                this.qtyForBackup = this.qty.quantity;
                this.addToCart();
            }
        } catch (e) {
            console.log(e.message);
            this.qty.quantity = 1;
        }
    }
    ngOnInit(): void {
        this.checkValue();
    }
    blurInvoke($event): void { 
        if (isNaN(this.qty.quantity) || this.qty.quantity <= 0) { 
            this.qty.quantity =1;
        }
        this.blurEvent.emit($event);
        
    }
    selectAll($event): void {
        this.focusEvent.emit($event);
        $event.target.select();
        var content = this.getParentIonContent($event.target);
        if (content == null) {
            return;
        }
        var rect = $event.target.getBoundingClientRect();
        var originBottom = rect.bottom ;
        if (content != null) {
            var msg   ="content.scrollTop:"+content.scrollTop+" rect.bottom:"+rect.bottom+"originBottom" + originBottom + " halfHeight:" + (screen.availHeight / 2);
            if (originBottom > (screen.availHeight / 2)) {
                var scrollUpLength = originBottom - screen.availHeight / 2;
                setTimeout(() => {
                    content.scrollTop = content.scrollTop + scrollUpLength+60;
                }, 200);

            //    alert("scrollUpLength" + scrollUpLength+" "+msg);
            } else {
                //alert(msg);
            }
        }




    }
    getParentIonContent(target) {
        var tmp = target;
        while (true) {
            tmp = tmp.parentElement;
            if (tmp == null || tmp.classList.contains("scroll-content")) {
                return tmp;
            }
        }
    }
    addToCart() {

        var cart = this.qty;
        var params = {
            cart_id: cart.cart_id,
            quantity: cart.quantity,
            options: cart.options
        };
        var promise = null;

        if (this.operation === "cart") {
            promise = this.httpUtil.editCart(params);

        } else if (this.operation === "selectedCart") {
            promise = this.httpUtil.editSelectedCart(params);
        }
        if (promise !== null) {
            promise.then((res) => {
                if (res.status === 0) {
                    this.qtyChange.emit(res.result);
                }
            });
        } else {
            this.qtyChange.emit(undefined);
        }

    }
}
