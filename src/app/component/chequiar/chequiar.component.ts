import { Component, OnInit } from '@angular/core';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chequiar',
  templateUrl: './chequiar.component.html',
  styleUrls: ['./chequiar.component.scss'],
})
export class ChequiarComponent implements OnInit {
  public data:any;
  public list_articulo:Array<Object>;
  constructor(
    private _store: Store<ARTICULOS>,
  ){ 
    this.data = {
      costo_total: 0
    };
    this._store.select("name")
    .subscribe((store:any)=>{
        console.log(store);
        this.list_articulo = store.cart;
        this.list_articulo.forEach((row:any)=>{
          row.active = true;
        });
        this.obj_cart();
    });
  }
  obj_cart(){
    let count_total     = Number(0);
    let count_cantidad  = Number(0);
    this.list_articulo.forEach((row:any) => {
      count_total+= parseFloat(row.costopromosion || 0) || parseFloat(row.costoventa || 0) * parseInt(row.cantida_adquiridad || 0);
      count_cantidad+= parseInt(row.cantida_adquiridad || 0);
    });
    this.data.costo_total = count_total.toFixed(2);
    this.data.count_articulo = count_cantidad;

  }
  ngOnInit() {}

  btn_guardar(obj:any){

  }

}
