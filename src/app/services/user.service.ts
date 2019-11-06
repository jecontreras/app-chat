import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { retryWhen, delayWhen, catchError, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { handleError } from './errores';
import { FactoryModelService } from './factory.model.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string;
  private handleError: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService
  ) {
    this.url = GLOBAL.url;
 }
  login(user: Object) {
    return this._model.create('user/login', user);
  }
  register(user: Object) {
    return this._model.create('user/register', user);
  }
  update(query:any = {}){
    return this._model.update('user', query.id ,query);
  }


  cabeza(query: any) {
    return this._model.query('user', {
      username: query
    });
  }
}
