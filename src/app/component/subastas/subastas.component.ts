import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { SubastasService } from 'src/app/service-component/subastas.service';
import { ProductoService } from 'src/app/service-component/producto.service';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { Router } from '@angular/router';
import { SubastaAction, SearchAction } from 'src/app/redux/app.actions';
import { ReduxserService } from 'src/app/service-component/redux.service';

@Component({
  selector: 'app-subastas',
  templateUrl: './subastas.component.html',
  styleUrls: ['./subastas.component.scss'],
})
export class SubastasComponent implements OnInit {

  public list_subasta:any = [];
  public ev:any = {};
  public disable_list:boolean = true;
  public data_user:any = {};

  constructor(
    private _subasta: SubastasService,
    private _producto: ProductoService,
    private _store: Store<ARTICULOS>,
    private _reduxer: ReduxserService,
    private router: Router,
  ) {

    this._store.select("name")
    .subscribe((store:any)=>{
      // console.log(store);
      this.data_user = store.user;
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0) this.router.navigate(['login']);
      if(Object.keys(store.subasta).length === 0) this.get_subasta();
      else this.list_subasta = store.subasta;
    });

   }

  ngOnInit() {}
  get_subasta(){
    return this._subasta.get({
      where:{
        creado: this.data_user.id
      }
    }).subscribe((rta:any)=>{
      // console.log(rta);
      rta = rta.data;
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      this._reduxer.data_redux(rta, 'subasta', this.list_subasta);
      this.list_subasta = rta;
    });
  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_subasta();
  }
  opent_chat(obj:any){
    // console.log(obj);
    let data:any = {
      id: obj.articulo.id,
      titulo: obj.articulo.titulo,
      costopromosion: obj.articulo.costopromosion,
      costoventa: obj.costoofreceventa
    };
    // console.log(this.data)
    let action = new SearchAction(data, 'post')
    this._store.dispatch(action);
    this.router.navigate(['/chat_view', obj.user.id]);
  }
}
