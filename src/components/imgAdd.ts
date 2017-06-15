import { Component, Input, OnInit ,EventEmitter} from '@angular/core';
import { ImagePicker } from 'ionic-native';

@Component({
    selector: 'img-add',
    template: `
       <div class="imgAdd" (click)="addImg()">
                <ion-icon name="add" class="icon-container" *ngIf="data.url === ''">
                <span class="identityDesc">{{imgDesc}}</span>
                </ion-icon>
                
                <img [src]="data.url"  *ngIf="data.url !== ''"/>
        </div>
  `,
  styles:[`
      .imgAdd {
            display: inline-block;
            font-size: 4rem;
            text-align: center;
            color: #ddd; 
        }
      .icon-container {
            border:1px solid;
            padding:1rem 2rem;
            margin-left:1rem;
       } 
      .identityDesc{
            font-size: 1.4rem;
            position: absolute;
            margin-top: 4rem;
            margin-left: -2.6rem;
      }
       img{
            max-width:3.5rem;
            margin-left:1rem;  
       }
  `]
})
export class ImgAddComponent implements OnInit {
    ngOnInit(): void { 
        this.data.url = "";
    }
    @Input() data:any = {};
    imgDesc:string
    @Input() set desc(desc: string){
        this.imgDesc = desc;
    }
     addImg() {  
        if(navigator["camera"] === undefined) 
        {
             return ;
        }
         
        navigator["camera"].getPicture((imageData)=>{
            this.data.url = "data:image/jpeg;base64," + imageData;  
        }, (err)=>{
            alert('Failed because: ' + err);
        }, {
            destinationType: 0,
            sourceType: 0,
         }); 
    }
}
