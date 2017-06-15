import { Component, Input, OnInit ,EventEmitter} from '@angular/core';
import { ImagePicker } from 'ionic-native';
//*ngIf="readOnly!=='1'"
@Component({
    selector: 'img-list',
    template: `
        <div class="panel">
            <div class="img-item" (click)="addImg(itm)" *ngFor="let itm of data.list" > 
                <img [src]="itm.url"  />
            </div>
            <div class="img-add" (click)="addImg(null)"  *ngIf="readOnly!=='1'">
                    <ion-icon name="add" class="icon-container" > </ion-icon> 
            </div>
        </div>
  `,
  styles:[`
    .panel{
        display: flex;
        align-items: center;
        background-color:white;
        padding:1rem 0;
        border-bottom: solid 1px #dce2e6;

    }
    .img-item{
        display: inline-block; 
    }
      .img-add {
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
       img{
            width: 6rem;
            height: 7rem;
            margin-left:1rem;  
       }
  `]
})
export class ImgListComponent implements OnInit {
    ngOnInit(): void { 
        this.data.list = [];
    }
    @Input() data:any = {};
    readOnly:string
    @Input() set isReadOnly(readOnly: string){
        this.readOnly = readOnly;
    }
    append(newUrl){
        if(this.data.list&& this.data.list.length){
            this.data.list.push({url:newUrl});
        }else{
            this.data.list = [{url:newUrl}]; 
        }
    }

    addImg(container) { 
        if(navigator["camera"] === undefined) { 

             setTimeout(()=>{
                 let newUrl = `data:image/png;base64,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ygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAAFooMwCAFsoMAKCFMgMAaKHMAABaKDMAgBbKDACghTIDAGihzAAAWigzAIAWygwAoIUyAwBoocwAADr8/fd/AXOj1pztrd/RAAAAAElFTkSuQmCC`;
                if(container === null){
                    this.append(newUrl);
                }else{
                    container.url = newUrl;
                }
             },1000);
             return ;
        }
        navigator["camera"].getPicture((imageData)=>{
            var newUrl = "data:image/jpeg;base64," + imageData;
            if(container === null){
                this.append(newUrl);
            }else{
                container.url = newUrl;
            }
        }, (err)=>{
            alert('Failed because: ' + err);
        }, {
            destinationType: 0,
            sourceType: 0,
         });
    }
}
