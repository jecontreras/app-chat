import { Component, OnInit, ViewChildren } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { ArchivoService } from 'src/app/service-component/archivo.services';
import { FormBuilder, Validators } from '@angular/forms';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { ComentarioService } from 'src/app/service-component/comentario.service';
import { ReduxserService } from 'src/app/service-component/redux.service';
import { ComentariosAction } from 'src/app/redux/app.actions';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  public evento:any = {};
  public data_user:any = {};
  public slidesItems:any = [];
  public myForm_comentar:any;
  public list_comentarios:any = [];
  public loading:any;

  constructor(
    private modalCtrl: ModalController,
    private _archivo: ArchivoService,
    private navparams: NavParams,
    private _store: Store<ARTICULOS>,
    public formBuilder: FormBuilder,
    public _comentario: ComentarioService,
    private _reduxer: ReduxserService,
    public loadingController: LoadingController,
  ) { 
    this.evento = (this.navparams.get('obj')) || {};
    // console.log(this.evento)
    this.init();
  }

  ngOnInit() {
  }
  async loadings(){
    this.loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Iniciando...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });

    await this.loading.present();
  }
  init(){
    if(Object.keys(this.evento).length === 0) this.cerrarModal();
    this.get_galeria(this.evento.id);
    this._store.select("name")
    .subscribe((store:any)=>{
      // console.log(store)
      this.data_user = store.user;
      if(Object.keys(this.data_user).length ===0) this.cerrarModal();
      if(Object.keys(store.comentarios).length === 0) {
        if(this.evento.opt === 'comentar'&& this.evento.id) this.get_comentario();
      }
      else {
        if(this.evento.opt === 'comentar' && this.evento.id) {
          this.validar_comentario(store.comentarios);
          // this.loading.dismiss();
        }
      }
    });
    this.myForm_comentar = this.createMyForm();
    if(this.evento.opt === 'comentar'){
      // this.get_comentario();
    }
  }
  cambiar_tab(){
    this.evento.opt = "comentar";
    this.init();
  }
  createMyForm(){
    return this.formBuilder.group({
      "comentario": ['', Validators.required],
      "opcion": [this.evento.opt, Validators.required],
      "negocios": [this.evento.id, Validators.required],
      "user": [this.data_user.id, Validators.required],
    });
  }
  get_galeria(id:any){
    this.loadings();
    return this._archivo.get({
      where:{
        negocios: id
      }
    })
    .subscribe((rta:any)=>{
      rta = rta.data[0];
      // console.log(rta);
      if(rta){
        this.slidesItems = rta.archivos;
      }else{
        this.slidesItems.push({id: 1, foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"})
      }
      this.loading.dismiss();
    },(err)=>{
      this.loading.dismiss();
    });
  }
  validar_comentario(obj:any){
    for(let row of obj){
      if(row.negocios.id === this.evento.id) {
        let idx = _.findIndex(this.list_comentarios, ['id', row.id]);
        if(idx == -1){
          this.list_comentarios.push(row);
        }
      }
    }
  }
  get_comentario(){
    // this.loadings();
    let query = {
      where:{
        user: this.data_user.id
      }
    };
    return this._comentario.get(query)
    .subscribe((rta:any)=>{
      rta = rta.data;
      // console.log(rta);
      this.proceso_comentario(rta);
      this.list_comentarios = rta;
      this.loading.dismiss();
    },(err)=>{
      this.loading.dismiss();
    });
  }
  proceso_comentario(obj:any){
    let lista:any = []
    for(let row of obj){
      if(row.negocios.id === this.evento.id) lista.push(row);
    }
    this._reduxer.data_redux(lista, 'comentario', this.list_comentarios);
  }
  onSubmit_comentario(){
    let data = this.myForm_comentar.value;
    console.log(data);
    return this._comentario.saved(data)
    .subscribe((rta:any)=>{
      console.log(rta);
      if(rta){
        this.myForm_comentar = this.createMyForm();
        let accion = new ComentariosAction(rta, 'post');
        this._store.dispatch(accion);
      }
    });
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  
}
