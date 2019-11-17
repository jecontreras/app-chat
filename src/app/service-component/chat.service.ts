import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private _model: FactoryModelService
  ) {
    // this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('chat', query);
  }
  get_detallado(query: any){
    return this._model.create('chat/get_chat_user', query);
  }
  saved (query: any){
    return this._model.create('chat/iniciar_chat', query);
  }
}