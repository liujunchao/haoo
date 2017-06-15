import {Injectable} from '@angular/core';
import {CartInfo} from './CartInfo';
export const CARTS:CartInfo[]=[
      {title:"A Fresh Cup",desc:"Enjoy freshly brewed coffee with deals on all your coffee-making essentials, including a KitchenAid coffee grinder, a french press with stainless steel frame, or a Keurig K55 coffee maker",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/07/fb/1f/07fb1f86-1a70-4200-832d-f6934b869172/heads/b1566db6-4925-43bd-8e1b-a186aea5127c.jpg", badge:"",bStatus:""},
      {title:"A Spooky Soirée",desc:"Throw a chilling Halloween fete with downright scary décor and games like this motion-sensor activated haunted antique typewriter, a Brain Freeze skull ice bucket by Final Touch, or an antique tin of witches",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/db/a0/7a/dba07ac7-01a7-4f9b-bb49-7ca842f31b0a/heads/2069DBD9-2ACD-43A8-BC61-6D7DAB1991DC.jpg", badge:"",bStatus:""},
      {title:"Game Day",desc:" Are you ready for football season? Shop deals on tailgating essentials, including a portable double folding chair with umbrella, a rolling 2-in-1 speaker cooler, or a cornhole bean bag game set",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/5e/25/6f/5e256f8d-74fa-4892-8b75-48533c3c3b72/heads/609E2972-1425-4126-9A2F-E10544615C8C.jpg", badge:"",bStatus:""}
] ;

@Injectable()
export class CartService{
    getCarts():Promise<CartInfo[]>  {
        return Promise.resolve(CARTS); 
  };
  getCartsSlowly(): Promise<CartInfo[]> {
    return new Promise<CartInfo[]>(resolve =>
        setTimeout(() => resolve(CARTS), 2000) // 2 seconds
    );
  }
}