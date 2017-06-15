import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
@Component({
    selector: 'hsvg', 
    template: `
       <svg class="icon " aria-hidden="true"  > 
        <use xlink:href="#icon-" ></use> 
       </svg> 
  `,
    styles: [` `]
})
export class IConComponent   { 
    iconName: string
    @Input() set name(iconName: string) {
        this.iconName = iconName;
    }  
}
