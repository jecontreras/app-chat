import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _model: FactoryModelService
  ) {
    // this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('app', query);
  }
  get_detalles(query: any){
    return this._model.create('appdetalles/getarticulo', query);
  }
  saved (query: any){
    return this._model.create('app', query);
  }
}