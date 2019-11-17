import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private _model: FactoryModelService
  ) {
    // this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('articulo', query);
  }
  saved (query: any){
    return this._model.create('articulo/saved', query);
  }
  edit(query:any){
    return this._model.update('articulo', query.id, query);
  }
  delete(query:any){
    return this._model.delete('articulo', query.id, query);
  }
  getGaleria(query: any){
    return this._model.query('galeria', query);
  }
}