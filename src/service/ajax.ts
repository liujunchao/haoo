import { BaseRequestOptions, Http, Headers, RequestMethod, Request } from '@angular/http';
import { Injectable } from "@angular/core";
import { Device } from 'ionic-native';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class AjaxService {
    constructor(private http: Http, private loadingCtrl: LoadingController) {
        if (AjaxService.deviceId === "") {
            AjaxService.deviceId = Device.uuid;
            if (AjaxService.deviceId === undefined) {
                AjaxService.deviceId = "from pc browser";
            }
        }
    }
    loading: Loading;
    setLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'ios',
            showBackdrop: false
        });

        this.loading.present();

    }
    static url: string = "http://haoo.idealhere.com:9980/index.php?route=";
    static deviceId: string = "";

    static getToken() {
        return localStorage["token"];
    }
    static isLogin() {
        return localStorage["token"] != null;
    }
    commonPost(method, body, fnBussinessError: Function, fnTokenError: Function) {
        this.setLoading();
        body = JSON.stringify(body);
        var requestObj = {
            headers: new Headers({ 'token': AjaxService.getToken(), 'imei': AjaxService.deviceId }),
            method: RequestMethod.Post,
            url: AjaxService.url + method,
            search: '',
            body: body
        };
        return new Promise<any>(resolve =>
            this.http.request(new Request(requestObj)).subscribe(res => {
                this.loading.dismiss().then(() => {
                    var rlt = res.json();
                    switch (rlt.status) {
                        case 0:
                            if (rlt.result && rlt.result.token) {
                                localStorage["token"] = rlt.result.token;
                            }
                            resolve(rlt);
                            break;
                        case 1:
                            fnBussinessError(rlt.msg);
                            break;

                        case 2:
                            fnTokenError();
                            break;
                    }
                });
                //   loader.dismiss();

            })
        );

    }

}