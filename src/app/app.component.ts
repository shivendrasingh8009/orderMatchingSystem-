import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
declare const $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  getBuyerData: any;
  getSellerData: any;
  completeArray:any=[];
  constructor(private http:HttpClient ){

  }
  title = 'my-angular';
ngOnInit(){
  this.getBuyer()
  this.getSeller()
}

///////////////////////get buyer///////////////////////////////
getBuyer(){
  this.http.get("http://localhost:8443/buyer/getapi").subscribe((res:any)=>{
    console.log("GET>>>>>>>",res)
    this.getBuyerData=res
   
  })

}

///////////////////////get Seller///////////////////////////
getSeller(){
  this.http.get("http://localhost:8443/seller/getapi").subscribe((res:any)=>{
    console.log("GET SELLER??>>>>>>>>",res)
    this.getSellerData=res;

  })

}




  createBuyer(price:any,qty:any,sprice:any,sqty:any){
    
    let obj={
      price:price,
      qty:qty,
      sprice:sprice,
      sqty:sqty
    }
    $("#buyerModel").hide()
    window.location.reload();

  this.http.post("http://localhost:8443/buyer/postapi",obj).subscribe((res:any)=>{
  })
  }

  updatePending(dataPrice:any,dataQty:any){
 

    this.http.patch("http://localhost:8443/buyer/update",{price:dataPrice,qty:dataQty}).subscribe((res:any)=>{
      this.getBuyer()
    })

  }
  deletPending(dataPrice:any){
  
    this.http.delete("http://localhost:8443/buyer/delete" +"/"+ dataPrice).subscribe((res:any)=>{
    })

  }

  createSeller(sprice:any,sqty:any){
    let obj={
      price:sprice,
      qty:sqty
    }
    $("#buyerModel").hide()
    window.location.reload();

    this.getBuyerData.map(async(item:any)=>{

      if(item.sellerPrice == sprice && item.sellerQty==sqty){
       await this.completeArray.push(item);

       await this.http.post("http://localhost:8443/seller/postapi",item).subscribe((res:any)=>{
          console.log("RES>>>>>>>",res)
          this.deletPending(res.sellerPrice)
          
          this.getSeller();
          this.getBuyer()
         
          })
      }else if(item.sellerPrice == sprice && item.sellerQty>sqty){
        await this.completeArray.push(item);
        
        let dataQty=(parseInt(item.sellerQty)-parseInt(sqty))
        await this.http.post("http://localhost:8443/seller/postapi",{price:item.sellerPrice,dataQty:sqty}).subscribe(async(res:any)=>{
         
          await this.updatePending(res.sellerPrice,dataQty)
           this.getSeller();
           this.getBuyer()
          
           })
       
      }else{

      }

    })
  }

}
