import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';
import { Store } from '@ngrx/store';
import { ARTICULOS } from '../redux/interfax/articulos';
import { NegociosAction, SubastaAction, ArticulosAction, MensajesAction, MensajesInitAction, NotificacionesAction, ComentariosAction } from '../redux/app.actions';

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
    let accion:any;
    // if(modelo === 'negocios') 
    // {
    //   let accion = new NegociosAction({}, 'drop');
    //   this._store.dispatch(accion);
    // }
    for(let row of data){
        let idx = lista.find(item => item.id == row.id);
        if(modelo === 'negocios') {
            if(idx) accion = new NegociosAction(row, 'put');
            else accion = new NegociosAction(row, 'post');
        }
        if(modelo === 'subasta') {
            if(idx) accion = new SubastaAction(row, 'put');
            else accion = new SubastaAction(row, 'post');
        }
        if(modelo === 'productos') {
            if(idx) accion = new ArticulosAction(row, 'put');
            else accion = new ArticulosAction(row, 'post');
        }
        if(modelo === 'chat') {
          if(idx) accion = new MensajesAction(row, 'put');
          else accion = new MensajesAction(row, 'post');
        }
        if(modelo === 'chat_init') {
          if(idx) accion = new MensajesInitAction(row, 'put');
          else accion = new MensajesInitAction(row, 'post');
        }
        if(modelo === 'notificaciones') {
          if(idx) accion = new NotificacionesAction(row, 'put');
          else accion = new NotificacionesAction(row, 'post');
        }
        if(modelo === 'comentario') {
          if(idx) accion = new ComentariosAction(row, 'put');
          else accion = new ComentariosAction(row, 'post');
        }
        if(accion) this._store.dispatch(accion);
      }
  }
}