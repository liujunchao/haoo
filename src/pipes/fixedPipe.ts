import {Pipe, PipeTransform} from '@angular/core';
 
  @Pipe({name: 'fixed'})
  export class FixedPipe implements PipeTransform {
    transform(value: string) {
    //  return "¥"+parseFloat(value).toFixed(2)
    
    if((""+value).indexOf(".")>-1){
      return "¥"+parseFloat(value).toFixed(2);
    }
      return "¥"+parseFloat(value);
    }
  }