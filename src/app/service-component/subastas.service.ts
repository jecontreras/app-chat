import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class SubastasService {

  constructor(
    private _model: FactoryModelService
  ) {
    // this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('subastas', query);
  }
  edit(query:any){
    return this._model.update('subastas', query.id, query);
  }
  saved (query: any){
    return this._model.create('subastas', query);
  }
}