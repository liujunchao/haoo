import { Component,Input,OnInit } from '@angular/core';
@Component({
  selector: 'img-show',
  template:`
       <div style=" display:inline-block; width:8rem; height:8rem;">
            <img src="{{url}}" style=" width:8rem;height:8rem; padding:5px; position:absolute " />
            <ion-badge class="ImgBadge" *ngIf="badge!==''||badge!==undefined">{{badge}}</ion-badge>
        </div>
  `,
  styles:[`
          .ImgBadge {
      border-radius: 200px;
      color: red;
      background-color: transparent;
      border: solid 1px;
      height: 3.2rem;
      line-height: 3.2rem;
      padding: 0px;
      position: absolute;
      margin-top: 5rem;
      margin-left: 5rem;
      z-index: 10;
  }
  `]
})
export class ImgShowComponent implements OnInit{
    @Input()
    url:string;
    @Input()
    badge:string;
    ngOnInit(): void {}
}
