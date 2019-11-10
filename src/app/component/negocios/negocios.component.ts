import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/service-component/producto.service';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { Router } from '@angular/router';
import { NegociosAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss']
})
export class NegociosComponent implements OnInit {

  public list_negocios:any = [];
  public data_user:any = {};
  public ev:any = {};
  public disable_list:boolean = true;

  constructor(
    private _producto: ProductoService,
    private _store: Store<ARTICULOS>,
    private router: Router,
  ) {
    this._store.select("name")
    .subscribe((store:any)=>{
      console.log(store);
      this.data_user = store.user;
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0) this.router.navigate(['login']);
      if(Object.keys(store.negocios).length === 0) this.get_articulo();
      else this.list_negocios = store.negocios;
    });


   }

  ngOnInit() {
  }
  get_articulo(){
    return this._producto.get({
      where:{
        opcion: 'activo'
      }
    })
    .subscribe((rta:any)=>{
      console.log(rta);
      rta = rta.data;
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      for(let row of rta){
        let idx = this.list_negocios.find(item => item.id == row.id);
        if(!idx){
          let accion:any = new NegociosAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_negocios = rta;
    });
  }

}
