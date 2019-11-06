import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MENSAJES } from 'src/app/redux/interfax/mensajes';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/service-component/chat.service';
import { MensajesInitAction } from 'src/app/redux/app.actions';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public list_mensajes: Array<Object> = [];
  
  public data_user:any;
  public store:any;
  public disable_list: boolean = true;
  public ev:any;

  constructor(
    private _store: Store<MENSAJES>,
    private router: Router,
    private route: ActivatedRoute,
    private _chat: ChatService
  ) {
    this._store.select("name")
      .subscribe((store: any) => {
        // console.log(store);
        this.store = store;
        this.data_user = store.user;
        if(Object.keys(this.data_user).length ===0){
          this.router.navigate(['login']);
        }
        if(Object.keys(store.mensajes_init).length > 0) this.list_mensajes = store.mensajes_init;
        else this.get_chat();
      });
  }
  ngOnInit() {
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_chat();
  }

  get_chat(){
    let query:any = {
      where:{
        or:[
          {emisor: this.data_user.id},
          {reseptor: this.data_user.id}
        ]
      },
      sort: 'updatedAt DESC'
    }
    return this._chat.get(query)
    .subscribe((rta:any)=>{
      // console.log(rta);
        if(this.ev){
          this.disable_list = true;
          if(this.ev.target){
            this.ev.target.complete();
          }
        }
        for(let row of rta.data){
          let idx = this.list_mensajes.find((item:any) => item.id == row.id);
          if(!idx){
            let accion:any = new MensajesInitAction(row, 'post');
            this._store.dispatch(accion);
          }
        }
        this.list_mensajes = _.unionBy(this.list_mensajes || [], rta.data, 'id');
    });
  }

  iniciar_chat(item:any){
    let id:any;
    if(item.reseptor.id === this.data_user.id)  id = item.emisor.id;
    else id = item.reseptor.id;
    this.router.navigate(['/chat_view', id]);
  }

}
