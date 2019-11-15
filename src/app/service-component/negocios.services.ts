import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(
    private _model: FactoryModelService
  ) {
    // this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('negocios', query);
  }
  saved (query: any){
    return this._model.create('negocios', query);
  }
  edit(query:any){
    return this._model.update('negocios', query.id, query);
  }
}