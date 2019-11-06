import { Injectable } from '@angular/core';
import { Config } from './config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { handleError } from './errores';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { MensajesAction, UserAction, NotificacionesAction, EventosAction } from '../redux/app.actions';
import { MENSAJES } from '../redux/interfax/mensajes';
import { Store } from '@ngrx/store';
declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class FactoryModelService {
  public url: string;
  private handleError: any;
  public user: any;
  public niveles: any;
  public global: any;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public app: Object = {};
  public sock: any;
  public disable_reconect: boolean = false;
  public interval:any;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private _store: Store<MENSAJES>,
  ) {
    this.url = GLOBAL.url;
    this.global = GLOBAL;
    this.handleError = handleError;

    this._store.select("name")
    .subscribe((store: any) => {
      if( Object.keys(store).length > 0 ) return true;
      this.user = store.user || {};
    });


    this.conectionSocket();
    this.createsocket("emitir", {mensaje:"inicial"});
  }

  async createsocket(modelo: string, query: any) {
    return new Promise(async (promesa) => {
      query.modelo = modelo;
      await this.sock.post(this.url + 'socket/emitir', query, (rta) => {
        // console.log(rta, modelo);
        promesa(rta)
      });
      promesa("exitoso");
    })

  }
  create(modelo: string, query: any): Observable<Config> {
    return this._http.post<Config>(this.url + modelo, query).pipe(
      map((data: any) => {
        data.metodo = 'POST';
        this.createsocket(modelo, data)
        return data;
      }),
      // retry(3),
      catchError(this.handleError)
    );
  }

  update(modelo: string, referencia: string, query: any): Observable<Config> {
    return this._http.put<Config>(this.url + modelo + '/' + referencia, query).pipe(
      map((data: any) => {
        data.metodo = 'UPDATE';
        this.createsocket(modelo, {mensaje:data})
        return data;
      }),
      // retry(3),
      catchError(this.handleError)
    );
  }

  delete(modelo: string, referencia: string, query: any) {
    return this._http.delete(this.url + modelo + '/' + referencia, query).pipe(
      map((data: any) => {
        data.metodo = 'DELETE';
        this.createsocket(modelo, data)
        return data;
      }),
      // retry(3),
      catchError(this.handleError)
    );
  }

  get(modelo: string, query: any) {
    if (query) {
      const options = {
        params: query
      };
      return this._http.get(this.url + modelo, options).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    } else {
      return this._http.get(this.url + modelo).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    }
  }

  query(modelo: string, query: any) {
    if (!query) {
      query = {};
    }
    if (!query.where) {
      query = {
        where: query
      }
        ;
    }
    const ruta = _.split(modelo, '/', 2);
    if (ruta[1]) {
      modelo = modelo;
    } else {
      modelo = modelo + '/query';
    }

    // query.app = this.adsSecuryty();
    return this._http.post(this.url + modelo, query).pipe(
      catchError(this.handleError)
    );
  }
  init_count() {
    let
      init: any = 0
    ;
    this.interval = setInterval(() => {
      init += 1;
      if (init === 3) {
        init = 0;
        if(this.disable_reconect) {
          this.conectionSocket();
        }
      }
    }, 1000);
  }
  
  stopConter(interval: any) {
    clearInterval(interval);
  }
  /* Primera la conexion de configuracion del socket */
  conectionSocket() {
    try {
      if (io) {
        io.sails.autoConnect = false;
        this.sock = io.sails.connect('https://back-ecomerce.herokuapp.com');
        this.scoket_global();
      }
    } catch (error) {
    }
  }

  scoket_global() {
    /* determinar  la conexion del socket con el back  */
    this.sock.on('connect',() => {
      console.log('conectado');
      this.disable_reconect = false;
      this.stopConter(this.interval);
    });
    /* Reconectar si se cae la conexion del socket */
    this.sock.on('disconnect', () =>{
      console.log('desconectado');
      this.disable_reconect = true;
      this.init_count()
    });

    /* los escuchas eventos chat/iniciar_chat*/
    this.sock.on('chat/iniciar_chat',(data:any)=>{
      this.user = JSON.parse(localStorage.getItem('user'));
      // console.log(data.data)
      if(data.metodo === 'POST'){
        if((data.data.emisor.id === this.user.id) || (data.data.reseptor.id === this.user.id)){
          let accion = new MensajesAction(data.data, 'post');
          this._store.dispatch(accion);
          if(data.data.reseptor.id === this.user.id){
            // console.log(data.data, this.user)
            this.notificar('assets/sonidos/platillos.mp3');
            // alert(`${data.data.reseptor.username} ${data.data.mensaje}`);
          }
          if(data.data.notificacion === true){
            let cuerpo:any = {
              id: data.data.id, 
              notificar: true,
              estado: 'no visto'
            };
            let accion:any = new EventosAction(cuerpo, 'post');
            this._store.dispatch(accion);
          }
        }
      }
      if(data.metodo === 'DELETE'){
        let accion = new MensajesAction(data.data, 'delete');
          this._store.dispatch(accion);
      }
    });

    /* los escuchas eventos user*/
    this.sock.on('user',(data:any)=>{
      // console.dir(data);
      this.user = JSON.parse(localStorage.getItem('user'));
      if(data.metodo === 'POST'){
        if((data.data.id === this.user.id)){
          let accion = new UserAction(data.data, 'post');
          this._store.dispatch(accion);
          this.notificar('assets/sonidos/platillos.mp3'); 
        }
      }
      if(data.metodo === 'UPDATE'){
        if((data.data.id === this.user.id)){
          let accion = new UserAction(data.data, 'put');
          this._store.dispatch(accion);
        }
      }
      if(data.metodo === 'DELETE'){
        if((data.data.id === this.user.id)){
          let accion = new UserAction(data.data, 'delete');
          this._store.dispatch(accion);
        }
      }
    });
  }
  notificar(obj){
    let sonido = new Audio();
    sonido.src = obj;
    sonido.load();
    sonido.play();
  }

}