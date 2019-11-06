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
    categoria: Array()
};
export function appReducer(state: any = APP, action: _action.actions) {
  if(JSON.parse(localStorage.getItem('APP'))) state = JSON.parse(localStorage.getItem('APP'));
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
    default: return state;
  }
}
