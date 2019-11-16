import { Component, OnInit, ViewChild } from '@angular/core';
import {IonContent} from '@ionic/angular';
import { FormGroup, FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { MensajesAction } from 'src/app/redux/app.actions';
import { Store } from '@ngrx/store';
import { MENSAJES } from 'src/app/redux/interfax/mensajes';
import * as _ from 'lodash';
import { ChatService } from 'src/app/service-component/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FactoryModelService } from 'src/app/services/factory.model.service';
import { ReduxserService } from 'src/app/service-component/redux.service';

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
  public unico:any = 0;
  phone_model = 'iPhone';
  input = '';
  @ViewChild('content') private content: any

  constructor(
    private _store: Store<MENSAJES>,
    private _chat: ChatService,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _reduxer: ReduxserService,
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
          this.unico = 0;
          this.ajuste_key_chat(store.mensajes);
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
      init++;
      this.unico++;
      if (init === 5) {
        init = 0;
      }
      if(this.unico === 1) this.scrollToBottomOnInit();
    }, 1000);
  }
  ngOnInit() {

  }
  scrollToBottomOnInit() {
    this.content.scrollToBottom(1000);
  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_chat();
  }
  ajuste_key_chat(obj:any){
    // obj = obj.filter(row=>(row.emisor.id === this.data_user.id && row.reseptor.id === this.id)
    //   || (row.emisor.id === this.id && row.reseptor.id === this.data_user.id)
    // );
    for(let row of obj){
      if(row.emisor.id === this.data_user.id){
        row.sender = 1;
        row.read = true;
        row.delivered = true;
        row.sent = true;
        row.foto = row.emisor.foto;
        row.user = row.emisor.username;
      }else{
        row.sender = 0;
        row.foto = row.emisor.foto;
        row.user = row.emisor.username;
      }

    }
    console.log(obj)
  }

  get_chat() {
    return this._chat.get_detallado({
      where: {
        reseptor: this.id,
        emisor: this.data_user.id
      },
      sort: 'createdAt DESC',
      limit: 20
    }).subscribe((rta: any) => {
      console.log(rta)
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      this._reduxer.data_redux(rta, 'chat_init', this.list_mensajes);
      this.ajuste_key_chat(rta.mensaje);
      this.list_mensajes = rta.mensaje;
      this.scrollToBottomOnInit();
      
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
          this.scrollToBottomOnInit();
      });

  }
}
