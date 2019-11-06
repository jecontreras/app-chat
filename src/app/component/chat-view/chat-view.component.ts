import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { MensajesAction } from 'src/app/redux/app.actions';
import { Store } from '@ngrx/store';
import { MENSAJES } from 'src/app/redux/interfax/mensajes';
import * as _ from 'lodash';
import { ChatService } from 'src/app/service-component/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FactoryModelService } from 'src/app/services/factory.model.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
})
export class ChatViewComponent implements OnInit {
  public list_mensajes: any = [{ emisor: {}, reseptor:{} }];
  public myForm_chat: FormGroup;
  public data: any = {};
  public data_user: any = {};
  public id: any;
  public disable_list:boolean = true;
  public ev:any;
  public count:any;
  public id_articulo:any;
  conversation = [
    { text: 'Hey, that\'s an awesome chat UIssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', sender: 0, image: './assets/images/sg2.jpg' },
    { text: 'Right, it totally blew my mind', sender: 1, image: './assets/images/sg1.jpg', read: true, delivered: true, sent: true },
    { text: 'And it is free ?', sender: 0, image: './assets/images/sg2.jpg' },
    { text: 'Yes, totally free', sender: 1, image: './assets/images/sg1.jpg', read: true, delivered: true, sent: true },
    { text: 'Wow, that\'s so cool', sender: 0, image: './assets/images/sg2.jpg' },
    { text: 'Hats off to the developers', sender: 1, image: './assets/images/sg1.jpg', read: false, delivered: true, sent: true },
    { text: 'Oh yes, this is gooood stuff', sender: 0, image: './assets/images/sg2.jpg' },
    { text: 'Check out their other designs ', sender: 1, image: './assets/images/sg1.jpg', read: false, delivered: false, sent: true }

  ]
  phone_model = 'iPhone';
  input = '';


  constructor(
    private _store: Store<MENSAJES>,
    private _chat: ChatService,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _model: FactoryModelService
  ) {
    this._store.select("name")
      .subscribe((store: any) => {
        // console.log(store);
        this.data_user = store.user;
        if (Object.keys(this.data_user).length === 0) {
          this.router.navigate(['login']);
        }
        if(Object.keys(store.mensajes).length >0) {
          // this.list_mensajes = store.mensajes;
          this.list_mensajes = _.unionBy(this.list_mensajes || [], store.mensajes, 'id');
          // this.list_mensajes = _.orderBy(this.list_mensajes, ['createdAt'], ['asc']);
        }else this.get_chat();
        this.id_articulo = store.search;
        // if(!store.search) this.router.navigate(['home']);
        // else 
    });
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = params['id'];
      }
    });
    this.myForm_chat = this.create_form();

    let
      init: any = 0
    ;
    let interval = setInterval(() => {
      init += 1;
      if (init === 5) {
        init = 0;
      }
    }, 1000);
  }
  ngOnInit() {

  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_chat();
  }
  get_chat() {
    return this._chat.get_detallado({
      where: {
        reseptor: this.id,
        emisor: this.data_user.id
      }
    }).subscribe((rta: any) => {
      console.log(rta)
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      for(let row of rta.mensaje){
        let idx = this.list_mensajes.find(item => item.id == row.id);
        if(!idx){
          let accion:any = new MensajesAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_mensajes = rta.mensaje;
      
    });
  }
  create_form() {
    // console.log(this.id)
    return this.formBuilder.group({
      mensaje: ['', Validators.required],
      emisor: [this.data_user.id, Validators.required],
      reseptor: [this.id, Validators.required],
      creado: [new Date(), Validators.required]
    });
  }
  submit_mensaje() {
    // console.log(this.myForm_chat.value);
    let data = this.myForm_chat.value;
        data.reseptor = this.id;
        data.emisor = this.data_user.id;
        data.articulo = this.id_articulo.id;
    console.log(data);
    return this._chat.saved(data)
      .subscribe((res: any) => {
        // console.log(res);
          this.myForm_chat = this.create_form();
      });

  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
}
