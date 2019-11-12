// app.ts

import * as _action from './app.actions';
import * as _ from 'lodash';

let APP = {
    nameapp: Object(),
    articulos: Array(),
    mensajes: Array(),
    mensajes_init: Array(),
    notificaciones: Array(),
    comentarios: Array(),
    compras: Array(),
    cart: Array(),
    favorito: Object(),
    user: Object(),
    search: Object(),
    eventos: Array(),
    categoria: Array(),
    subasta: Array(),
    negocios: Array()
};
export function appReducer(state: any = APP, action: _action.actions) {
  if(JSON.parse(localStorage.getItem('APP'))) {
    state = JSON.parse(localStorage.getItem('APP'));
    validacion_key(state);
  }
  else {
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(state));
  }
  // console.log(state);
  function local_Storage(APP){
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(APP));
    state = JSON.parse(localStorage.getItem('APP'));
    return state
  }
  function proceso_data(lista:any, data:any, opt){
    let idx = _.findIndex(lista, ['id', data.id]);
    if(idx >-1){
      if(opt === 'delete') lista.splice(idx, 1);
      else lista[idx]= data;
    }else{
      if(opt === 'post') lista.push(data);
    }
    return lista;
  }
  function validacion_key(state){
    if(!state.articulos) state.articulos = [];
    if(!state.cart) state.cart = [];
    if(!state.categoria) state.categoria = [];
    if(!state.comentarios) state.comentarios = [];
    if(!state.compras) state.compras = [];
    if(!state.eventos) state.eventos = [];
    if(!state.favorito) state.favorito = {};
    if(!state.mensajes) state.mensajes = [];
    if(!state.mensajes_init) state.mensajes_init = [];
    if(!state.nameapp) state.nameapp = {};
    if(!state.notificaciones) state.notificaciones = [];
    if(!state.search) state.search = {};
    if(!state.subasta) state.subasta = [];
    if(!state.user) state.user = {};
    if(!state.negocios) state.negocios = [];
  }
  switch (action.type) {
    case _action.NAMEAPP:{
      state.nameapp = action.payload;
      return local_Storage(state);
    }
    break;
    case _action.ARTICULOS:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.articulos) state.articulos = [];
          state.articulos.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.articulos, ['id', action.payload['id']]);
          if(idx >-1){
            state.articulos[idx]= action.payload;
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.articulos, ['id', action.payload['id']]);
          if(idx >-1){
            state.articulos.splice(idx, 1);
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.MENSAJES:{
      switch (action.opt){
        case 'post': {
          if(!state.mensajes) state.mensajes = [];
          state.mensajes.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.mensajes, ['id', action.payload['id']]);
          if(idx >-1){
            state.mensajes[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.mensajes, ['emisor', action.payload['emisor']]);
          if(idx >-1){
            state.mensajes.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.MENSAJESINIT:{
      switch (action.opt){
        case 'post': {
          if(!state.mensajes_init) state.mensajes_init = [];
          state.mensajes_init.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.mensajes_init, ['id', action.payload['id']]);
          if(idx >-1){
            state.mensajes_init[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.mensajes_init, ['emisor', action.payload['emisor']]);
          if(idx >-1){
            state.mensajes_init.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.NOTIFICACIONES:{
      switch (action.opt){
        case 'post': {
          if(!state.notificaciones) state.notificaciones = [];
          state.notificaciones.push(action.payload);
          
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.notificaciones, ['id', action.payload['id']]);
          if(idx >-1){
            state.notificaciones[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.notificaciones, ['id', action.payload['id']]);
          if(idx >-1){
            state.notificaciones.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.COMENTARIOS: {
      switch (action.opt){
        case 'post': {
          if(!state.comentarios) state.comentarios = [];
          state.comentarios.push(action.payload);
          
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.comentarios, ['id', action.payload['id']]);
          if(idx >-1){
            state.comentarios[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.comentarios, ['id', action.payload['id']]);
          if(idx >-1){
            state.comentarios.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.COMPRAS:{
      switch (action.opt){
        case 'post': {
          if(!state.compras) state.compras = [];
          state.compras.push(action.payload);
          
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.compras, ['id', action.payload['id']]);
          if(idx >-1){
            state.compras[idx]= action.payload;
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.compras, ['id', action.payload['id']]);
          if(idx >-1){
            state.compras.splice(idx, 1);
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.CART: {
      switch(action.opt) {
        case 'post' :
            !state.cart  ? state.cart = [] : ''; 
            state.cart.push(action.payload);
            return local_Storage(state);
        break;
        case 'put': {
          let idx = _.findIndex(state.cart, ['id', action.payload['id']]);
          if(idx >-1){
            state.cart[idx]= action.payload;
          }
          return local_Storage(state);
        }
        break;
        case 'delete': 
        let idx = _.findIndex(state.cart, ['id', action.payload['id']]);
          if(idx >-1){
            state.cart.splice(idx, 1);
          }
          return local_Storage(state);
        break;
      }
    }
    break;
    case _action.USER: {
      switch(action.opt) {
        case 'post' :
          if(!state.user) state.user = {};
            state.user = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.user = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.user = {};
          break;
          return local_Storage(state);
      }
    }
    case _action.SEARCH: {
      switch(action.opt){
        case 'post':{
          state.search = action.payload;
          return local_Storage(state);
        }
        break;
        default: return state;
      }
    }
    break;
    case _action.EVENTOS:{
      switch (action.opt){
        case 'post': {
          if(!state.eventos) state.eventos = [];
          state.eventos.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.eventos, ['id', action.payload['id']]);
          if(idx >-1){
            state.eventos[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.eventos, ['id', action.payload['id']]);
          if(idx >-1){
            state.eventos.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.CATEGORIA:{
      switch (action.opt){
        case 'post': {
          if(!state.categoria) state.categoria = [];
          state.categoria.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.categoria, ['id', action.payload['id']]);
          if(idx >-1){
            state.categoria[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.categoria, ['id', action.payload['id']]);
          if(idx >-1){
            state.categoria.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.SUBASTA:{
      switch (action.opt){
        case 'post': {
          if(!state.subasta) state.subasta = [];
          state.subasta.push(action.payload);
          return local_Storage(state);
        }
        break;
        case 'put': {
          let idx = _.findIndex(state.subasta, ['id', action.payload['id']]);
          if(idx >-1){
            state.subasta[idx]= action.payload;
            
          }
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let idx = _.findIndex(state.subasta, ['id', action.payload['id']]);
          if(idx >-1){
            state.subasta.splice(idx, 1);
            
          }
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    case _action.NEGOCIOS:{
      switch (action.opt){
        case 'post': {
          if(!state.negocios) state.negocios = [];
          let data = proceso_data(state.negocios,action.payload, 'post');
          state.negocios = data;
          return local_Storage(state);
        }
        break;
        case 'put': {
          let data = proceso_data(state.negocios,action.payload, 'put');
          state.negocios = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          let data = proceso_data(state.negocios,action.payload, 'delete');
          state.negocios = data;
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;
    default: return state;
  }
}
