import { AfterViewInit, Component, ElementRef, Renderer,Injectable } from '@angular/core';
 
import { Config,NavParams,ViewController,App,NavOptions} from 'ionic-angular';


/**
 * @private
 */
@Component({
  selector: 'my-toast',
  template:
    '<div class="toast-wrapper" ' +
      '[class.toast-bottom]="d.position === \'bottom\'" ' +
      '[class.toast-middle]="d.position === \'middle\'" ' +
      '[class.toast-top]="d.position === \'top\'"> ' +
      '<div class="toast-container"> ' +
        '  <ion-icon name="ios-checkmark-circle-outline"  *ngIf="d.showSuccessIcon"></ion-icon>'+
        '  <ion-icon name="ios-alert-outline"  *ngIf="d.showErrorIcon"></ion-icon>'+
        '<div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div> ' +
        '<button ion-button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()"> ' +
          '{{ d.closeButtonText || \'Close\' }} ' +
         '</button> ' +
      '</div> ' +
    '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  },
  styles:[`
    .toast-wrapper{
        z-index:99999;
    }
    .toast-container{
        display:block; 
        text-align:center;
    }
    .toast-middle{
        top:45% !important;
    } 
    ion-icon{ 
        font-size: 3rem;
        padding: 1.5rem 0;
        font-weight: bold;
    }
    .toast-wrapper{
        width:25rem;
    }
    ion-icon[name="ios-checkmark-circle-outline"]{
        color:#23d941; 
    }
    ion-icon[name="ios-alert-outline"]{
        color:red; 
    }
    .toast-message{
        font-size:1.7rem;
        padding:0;
        padding-bottom:1rem;
    }
  `]
})
export class MyToastCmp implements AfterViewInit {
  d: {
    message?: string;
    cssClass?: string;
    duration?: number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    dismissOnPageChange?: boolean;
    position?: string;
  };
  descId: string;
  dismissTimeout: number = undefined;
  enabled: boolean;
  hdrId: string;
  id: number;
 
  constructor(
    public _viewCtrl: ViewController,
    public _config: Config,
    public _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {
    renderer.setElementClass(_elementRef.nativeElement, `toast-${_config.get('mode')}`, true);
    this.d = params.data;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++toastIds);
    if (this.d.message) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
  }

  ngAfterViewInit() {
    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout = (<any>setTimeout(() => {
          this.dismiss('close');
        }, this.d.duration));
    }
    this.enabled = true;
  }

  ionViewDidEnter() {
    const { activeElement }: any = document;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');

    if (focusableEle) {
      focusableEle.focus();
    }
  }

  cbClick() {
    if (this.enabled) {
      this.dismiss('close');
    }
  }

  dismiss(role: any): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    return this._viewCtrl.dismiss(null, role, {});
  }
  
}

let toastIds = -1;

export class MyToast extends ViewController {
  private _app: App;

  constructor(app: App, opts = {}) {
     super(MyToastCmp, opts);
    this._app = app;
 
  
    this.isOverlay = true;
  }

  isTimeOutActive(){
    
  }
  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
  * @private
  */
  isValidPosition(position: string) {
    return true;
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * Present the toast instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    //navOptions.disableApp = false;
    return this._app.present(this, navOptions);
  }

  /**
   * Dismiss all toast components which have been presented.
   */
  dismissAll() { 
    this._nav && this._nav.pop();
  }

}

@Injectable()
export class MyToastController {

  constructor(private _app: App) {} 
  
  create(opts) { 
    return new MyToast(this._app, opts);
  } 
  clearToast(){ } 
  toast(msg, isError) {
    isError  = true;
    if(isError === true){
      if(window["plugins"] === undefined){
        alert(msg);
      }else{
        window["plugins"].toast.show(msg, 'short', 'center');
      }
      return ;
    } 
    return new Promise((resolve,reject)=>{
        let options = {
            message: msg,
            showSuccessIcon: true,
            showErrorIcon: true,
            position: "middle", 
        }
        if (isError) {
            delete options.showSuccessIcon;
        } else {
            delete options.showErrorIcon;
        }
        let ctrl = this.create(options);
        ctrl.present();  
         setTimeout(()=>{
          ctrl.dismiss().then(()=>{ 
            resolve(); 
          }).catch(()=>{
            alert("i am refused");
          });
        }, 1000);
    });
    
  }

}