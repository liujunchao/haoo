import { BaseRequestOptions, Http, Headers, RequestMethod, Request } from '@angular/http';
import { AlertController, NavController, ViewController, LoadingController, Loading } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Device } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
@Injectable()
export class HttpUtil {
    constructor(private http: Http, private alertCtrl: AlertController, private navController: NavController, private viewController: ViewController, private loadingCtrl: LoadingController) {
        if (HttpUtil.deviceId === "") {
            HttpUtil.deviceId = Device.uuid;
            if (HttpUtil.deviceId === undefined) {
                HttpUtil.deviceId = "from pc browser";
            }
        }
    }
    isloading: boolean = false;
    loading: Loading;
    static url: string = "http://haoo.idealhere.com:9980/index.php?route=";
    static deviceId: string = "";

    static getToken() {
        return localStorage["token"];
    }
    setLoading() {
        if (this.isloading === false) {
            this.isloading = true;
            this.loading = this.loadingCtrl.create({
                spinner: 'ios',
                showBackdrop: false
            });

            this.loading.present();
        }

    }
    hideLoading(callback: Function) {
        if (this.isloading === true) {
            this.loading.dismiss().then(() => {
                callback && callback();
            });
            this.isloading = false;
        } else {
            callback && callback();
        }

    }

    isLogin() {
        return localStorage["token"] != null;
    }
    commonPost(method, body) {
        body = JSON.stringify(body);
        var requestObj = {
            headers: new Headers({ 'token': HttpUtil.getToken(), 'imei': HttpUtil.deviceId }),
            method: RequestMethod.Post,
            url: HttpUtil.url + method,
            search: '',
            body: body
        };
        return new Promise<any>(resolve =>
            this.http.request(new Request(requestObj)).subscribe(res => {
                //   loader.dismiss();

                var rlt = res.json();
                switch (rlt.status) {
                    case 0:
                        if (rlt.result && rlt.result.token) {
                            localStorage["token"] = rlt.result.token;
                        }
                        resolve(rlt);
                        this.hideLoading(undefined);
                        break;
                    case 1:
                        alert("失败：" + rlt.msg);
                        this.hideLoading(undefined);
                        break;

                    case 2:

                        this.hideLoading(() => {
                            let confirm = this.alertCtrl.create({
                                title: '失败',
                                message: rlt.msg,
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: () => {
                                            let navTransition = confirm.dismiss();
                                            localStorage.removeItem("token");
                                            navTransition.then(() => {
                                                this.navController.push(LoginPage);
                                            });
                                            return false;
                                        }
                                    }
                                ]
                            });
                            confirm.present();
                        });
                        break;
                }
            })
        );
    }
    notify(title, msg) {
        var dlg = this.alertCtrl.create({
            title: title,
            message: msg
        });
        dlg.present();

        return dlg;
    }
    login(json) {
        return this.commonPost("haooapi/login", json);
    }
    register(json) {
        return this.commonPost("haooapi/register", json);
    }
    getModules() {
       // this.setLoading();
        return this.commonPost("haooapi/module", {});
    }
    getProducts(cid, index) {
        return this.commonPost("haooapi/module/getProducts", {
            product_group_id: cid,
            index: index,
            rows: 10
        });
    }
    getProductsByCategory(obj) {
        this.setLoading();
        return this.commonPost("haooapi/category/getProducts", obj);
    }
    getProduct(pid) {
        this.setLoading();
        return this.commonPost("haooapi/product", { pid: pid });
    }
    getCategories() {
        return this.commonPost("haooapi/category", {});
    }
    addToCart(cart) {
        return this.commonPost("haooapi/cart/addToCart", cart);
    }
    addToSelectedCart(cart) {
        return this.commonPost("haooapi/selected_cart/addToSelectedCart", cart);
    }
    getSelectedCarts() {
        return this.commonPost("haooapi/selected_cart", {});
    }
    deleteSelectedCart(cart_id) {
        return this.commonPost("haooapi/selected_cart/deleteSelectedCart", { cart_id: cart_id });
    }
    showErrors(title, msg) {
        let ctrl = this.alertCtrl.create({
            title: title,
            message: msg
        });
        ctrl.present();

    }
    getBanners() {
        return this.commonPost("haooapi/banner", {});
    }
    getProductListInCart() {
        this.setLoading();
        return this.commonPost("haooapi/cart", {});
    }
    getZones() {

        return this.commonPost("haooapi/address/getZone", {});
    }
    getCities(zone_id) {

        return this.commonPost("haooapi/address/getCity", { zone_id: zone_id });
    }
    getDistricts(city_id) {

        return this.commonPost("haooapi/address/getDistrict", { city_id: city_id });
    }
    addAddress(data) {
        return this.commonPost("haooapi/address/addAddress", data);
    }
    getAddresses(obj) {
        this.setLoading();
        return this.commonPost("haooapi/address", obj);
    }
    deleteAddress(addrId) {
        return this.commonPost("haooapi/address/deleteAddress", {
            address_id: addrId
        });
    }
    getAddressInfo(address_id) {
        return this.commonPost("haooapi/address/getAddressInfo", { address_id: address_id });
    }
    editAddress(addr) {
        return this.commonPost("haooapi/address/editAddress", addr);
    }
    setDefaultAddress(address_id) {
        return this.commonPost("haooapi/address/setDefaultAddress", { address_id: address_id });
    }
    deleteCart(cart_id) {
        return this.commonPost("haooapi/cart/deleteCart", { cart_id: cart_id });
    }
    createOrder(payment_method, address_id, from) {
        return this.commonPost("haooapi/order/createOrder", {
            payment_method: payment_method,
            address_id: address_id,
            from: from
        });
    }
    payOrder(payment_method, order_id) {
        return this.commonPost("haooapi/order/payOrder", {
            payment_method: payment_method,
            order_id: order_id
        });
    }
    rebuyCheckout(order_id, payment_method, address_id, products_list) {
        return this.commonPost("haooapi/order/reBuyCheckout", {
            payment_method: payment_method,
            address_id: address_id,
            products_list: products_list,
            order_id: order_id
        });
    }
    getOrderList(order_type, index) {
        this.setLoading();
        return this.commonPost("haooapi/order/getOrderList", {
            order_type: order_type,
            index: index,
            rows: 10
        });
    }
    cancelOrder(order_id) {
        return this.commonPost("haooapi/order/cancelOrder", {
            order_id: order_id
        });
    }
    rebuyOrder(order_id) {
        this.setLoading();
        return this.commonPost("haooapi/order/reBuy", {
            order_id: order_id
        });
    }
    getOrderDetail(order_id) {
        this.setLoading();
        return this.commonPost("haooapi/order/getOrderDetail", {
            order_id: order_id
        });
    }
    search(condition) {
        this.setLoading();
        return this.commonPost("haooapi/search", condition);
    }
    moveToCart(cart_ids) {
        return this.commonPost("haooapi/selected_cart/moveToCart", {
            products_list: cart_ids
        })
    }
    checkout() {
        this.setLoading();
        return this.commonPost("haooapi/cart/checkout", {});
    }
    selectCart(selected: boolean, cart_id: string) {
        return this.commonPost("haooapi/cart/selectCart", {
            cart_id: cart_id,
            selected: selected ? 1 : 0
        });
    }
    selectSelectedCart(selected: boolean, cart_id: string) {
        return this.commonPost("haooapi/selected_cart/selectSelectedCart", {
            cart_id: cart_id,
            selected: selected ?1 : 0
        });
    }
    editCart(obj) {
        return this.commonPost("haooapi/cart/editCart", obj);
    }
    editSelectedCart(obj) {
        return this.commonPost("haooapi/selected_cart/editSelectedCart", obj);
    }
    getSelectedCartInfo() {
        return this.commonPost("haooapi/selected_cart/getSelectedCart", {});
    }
    forgetPassword(email) {
        return this.commonPost("haooapi/forget", { email: email });
    }
    getProductsTotals(obj) {
        return this.commonPost("haooapi/product/getProductsTotals", obj);
    }
    selected_cart_selectAll(isSelectedAll) {
        this.setLoading();
        return this.commonPost("haooapi/selected_cart/selectAll", {
            selected: isSelectedAll ? 1 : 0
        });
    }
    cart_selectAll(isSelectedAll) {
        this.setLoading();
        return this.commonPost("haooapi/cart/selectAll", {
            selected: isSelectedAll ? 1 : 0
        });
    }
    returnOrder(obj) {
        return this.commonPost("haooapi/order/returnOrder", obj);
    }
    getUnreadTotal() {
        return this.commonPost("haooapi/notice/getUnreadTotal", {});
    }
    //分组类型[new:新品|delivery:发货|return:退货|refund:退款]
    getNoticeListByGroup(type) {
        return this.commonPost("haooapi/notice/getNoticeListByGroup", { type: type });
    }
    getUnreadTotalByGroup() {
        return this.commonPost("haooapi/notice/getUnreadTotalByGroup", {});
    }
    getCartQuantityTotal() {
        return this.commonPost("haooapi/cart/getCartQuantityTotal", {});
    }
    getOrderQuestion(order_id) {
        return this.commonPost("haooapi/order/getOrderQuestion", { order_id: order_id });
    }
    submitQuestion(order_id, msg) {
        return this.commonPost("haooapi/order/submitQuestion", { order_id: order_id, msg: msg });
    }

    getCustomer() {
        return this.commonPost("haooapi/customer", {});
    }

    saveCustomer(info) {
        return this.commonPost("haooapi/customer/save", info);
    }

    getProductPrice(pid,quantity,options) {
        this.setLoading();
        return this.commonPost("haooapi/product/getProductPrice", {
            pid:pid,
            quantity:quantity,
            options:options
        });
    }

    when(callback: Function, ...promises) {
        var args = [];
        var cnt = promises.length;
        var me  = this;
        var counter = function () {
            var index = -1;
            var assignCount = 0;
            return {
                invokeCallback :function(idx,result){
                    assignCount++;
                    args[idx] = result;
                    if(assignCount === cnt){
                        callback.apply(me,args);
                    }
                },
                increase: function () { 
                    return function (rlt) {
                        this.invokeCallback(this.index,rlt);
                    }.bind({
                        index:++index,
                        invokeCallback:this.invokeCallback
                    });

                }
            }
        }();

        for (let promise of promises) {
            if (promise instanceof Promise) {
                promise.then(counter.increase());
            } else {
                throw new Error("should be promises"); 
            }
        }
    }
}