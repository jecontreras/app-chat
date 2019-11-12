import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';
import { Store } from '@ngrx/store';
import { ARTICULOS } from '../redux/interfax/articulos';
import { NegociosAction } from '../redux/app.actions';

@Injectable({
  providedIn: 'root'
})
export class ReduxserService {

  constructor(
    private _model: FactoryModelService,
    private _store: Store<ARTICULOS>,
  ) {
    // this.cuerpo = this._model;
  }
  data_redux(data: any, modelo:any, lista:any){
    for(let row of data){
        let idx = lista.find(item => item.id == row.id);
        let accion:any;
        if(modelo === 'negocios') {
            if(idx) accion = new NegociosAction(row, 'put');
            else accion = new NegociosAction(row, 'post');
        }
        // if(modelo === 'negocios') {
        //     if(idx) accion = new NegociosAction(row, 'put');
        //     else accion = new NegociosAction(row, 'post');
        // }
        // if(modelo === 'negocios') {
        //     if(idx) accion = new NegociosAction(row, 'put');
        //     else accion = new NegociosAction(row, 'post');
        // }
        if(accion) this._store.dispatch(accion);
      }
  }
}