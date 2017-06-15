import {Injectable} from '@angular/core';
import {CartService} from './CartService';
import {CartInfo} from './CartInfo';
import {Order} from './order';
export const carts1:CartInfo[]=[
      {title:"A Fresh Cup",desc:"Enjoy freshly brewed coffee with deals on all your coffee-making essentials, including a KitchenAid coffee grinder, a french press with stainless steel frame, or a Keurig K55 coffee maker",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/07/fb/1f/07fb1f86-1a70-4200-832d-f6934b869172/heads/b1566db6-4925-43bd-8e1b-a186aea5127c.jpg", badge:"",bStatus:"settle"},
      {title:"A Spooky Soirée",desc:"Throw a chilling Halloween fete with downright scary décor and games like this motion-sensor activated haunted antique typewriter, a Brain Freeze skull ice bucket by Final Touch, or an antique tin of witches",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/db/a0/7a/dba07ac7-01a7-4f9b-bb49-7ca842f31b0a/heads/2069DBD9-2ACD-43A8-BC61-6D7DAB1991DC.jpg", badge:"",bStatus:"settle"} 
] ;
export const carts2:CartInfo[]=[
      {title:"A Fresh Cup",desc:"Enjoy freshly brewed coffee with deals on all your coffee-making essentials, including a KitchenAid coffee grinder, a french press with stainless steel frame, or a Keurig K55 coffee maker",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/07/fb/1f/07fb1f86-1a70-4200-832d-f6934b869172/heads/b1566db6-4925-43bd-8e1b-a186aea5127c.jpg", badge:"",bStatus:"notSettle"},
      {title:"A Spooky Soirée",desc:"Throw a chilling Halloween fete with downright scary décor and games like this motion-sensor activated haunted antique typewriter, a Brain Freeze skull ice bucket by Final Touch, or an antique tin of witches",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/db/a0/7a/dba07ac7-01a7-4f9b-bb49-7ca842f31b0a/heads/2069DBD9-2ACD-43A8-BC61-6D7DAB1991DC.jpg", badge:"",bStatus:"shortage"},
      {title:"Game Day",desc:" Are you ready for football season? Shop deals on tailgating essentials, including a portable double folding chair with umbrella, a rolling 2-in-1 speaker cooler, or a cornhole bean bag game set",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/5e/25/6f/5e256f8d-74fa-4892-8b75-48533c3c3b72/heads/609E2972-1425-4126-9A2F-E10544615C8C.jpg", badge:"",bStatus:"delivery"}
] ;
export const carts3:CartInfo[]=[
      {title:"A Fresh Cup",desc:"Enjoy freshly brewed coffee with deals on all your coffee-making essentials, including a KitchenAid coffee grinder, a french press with stainless steel frame, or a Keurig K55 coffee maker",price:10,quantity:10,url:"http://eimg.idealhere.com/ImageFormal/07/fb/1f/07fb1f86-1a70-4200-832d-f6934b869172/heads/b1566db6-4925-43bd-8e1b-a186aea5127c.jpg", badge:"",bStatus:"purchase"} 
] ;



@Injectable()
export class OrderService{
  
    getOrders():Promise<Order[]>  { 
        var order1 = new Order();
        order1.items = carts1;
        order1.status = "paid"; 
        var order2 = new Order();
        order2.items = carts2;
        order2.status = "cancelled"; 
        var order3 = new Order();
        order3.items = carts3;
        order3.status = "unpaid"; 
       var order4 = new Order();
        order4.items = carts1;
        order4.status = "delivery"; 
        var order5= new Order();
        order5.items = carts3;
        order5.status = "unpaid"; 
       var order6 = new Order();
        order6.items = carts1;  
        return Promise.resolve([order1,order2,order3,order4,order5,order6]); 
  }; 
}