import { Action } from "@ngrx/store";

export let NAMEAPP          = '[App] Nameapp';
export let ARTICULOS        = '[App] Articulo';
export let MENSAJES         = '[App] Mensajes';
export let MENSAJESINIT     = '[App] Mensajesinit';
export let NOTIFICACIONES   = '[App] Notificaciones';
export let COMENTARIOS      = '[App] Comentarios';
export let COMPRAS          = '[App] Compras';
export let CART             = '[App] Cart';
export let USER             = '[App] User';
export let SEARCH           = '[App] Search';
export let EVENTOS          = '[App] Eventos';
export let CATEGORIA        = '[App] Categoria';

export class NameappAction implements Action {
    readonly type = NAMEAPP;
    constructor( public payload: object,  public opt: string){}
}
export class ArticulosAction implements Action {
    readonly type = ARTICULOS;
    constructor( public payload: object,  public opt: string){}
}
export class MensajesAction implements Action {
    readonly type = MENSAJES;
    constructor( public payload: object,  public opt: string){}
}
export class MensajesInitAction implements Action {
    readonly type = MENSAJESINIT;
    constructor( public payload: object,  public opt: string){}
}
export class NotificacionesAction implements Action {
    readonly type = NOTIFICACIONES;
    constructor( public payload: object,  public opt: string){}
}
export class ComprasAction implements Action {
    readonly type = COMPRAS;
    constructor( public payload: object,  public opt: string){}
}

export class CartAction implements Action {
    readonly type = CART;
    constructor( public payload: object,  public opt: string){}
}

export class UserAction implements Action {
    readonly type = USER;
    constructor( public payload: object,  public opt: string){}
}

export class SearchAction implements Action {
    readonly type = SEARCH;
    constructor( public payload: any,  public opt: string){}
}

export class EventosAction implements Action {
    readonly type = EVENTOS;
    constructor( public payload: any,  public opt: string){}
}

export class CategoriaAction implements Action {
    readonly type = CATEGORIA;
    constructor( public payload: any,  public opt: string){}
}

export type actions = NameappAction         |
                      ArticulosAction       |
                      MensajesAction        |
                      NotificacionesAction  |
                      ComprasAction         |
                      CartAction            |
                      UserAction            |
                      SearchAction          |
                      MensajesInitAction    |
                      EventosAction         |
                      CategoriaAction       ;