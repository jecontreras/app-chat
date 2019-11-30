import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/service-component/producto.service';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { Router } from '@angular/router';
import { NegociosAction } from 'src/app/redux/app.actions';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { NegociosPage } from 'src/app/dialog/form/negocios/negocios.page';
import { NegociosService } from 'src/app/service-component/negocios.services';
import { ReduxserService } from 'src/app/service-component/redux.service';
import { PublicacionPage } from 'src/app/dialog/view/publicacion/publicacion.page';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss']
})
export class NegociosComponent implements OnInit {

  public list_negocios:any = [];
  public data_user:any = {};
  public ev:any = {};
  public disable_list:boolean = true;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private _producto: ProductoService,
    private _negocios: NegociosService,
    private _store: Store<ARTICULOS>,
    private modalCtrl: ModalController,
    private router: Router,
    private _reduxer: ReduxserService
  ) {
    this._store.select("name")
    .subscribe((store:any)=>{
      console.log(store);
      this.data_user = store.user;
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0) this.router.navigate(['login']);
      if(Object.keys(store.negocios).length === 0) this.get_articulo();
      else this.list_negocios = store.negocios;
    });


   }

  ngOnInit() {
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      event.target.disabled = true;
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  get_articulo(){
    return this._negocios.get({
      where:{
        estado: 'activo'
      }
    })
    .subscribe((rta:any)=>{
      console.log(rta);
      rta = rta.data;
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      this._reduxer.data_redux(rta, 'negocios', this.list_negocios);
      this.list_negocios = rta;
    });
  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_articulo();
  }
  open_form(obj) {
    this.modalCtrl.create({
      component: NegociosPage,
      componentProps: {
        obj: obj
      }
    }).then(modal=>modal.present());
  }
  open_view(obj:any, opt:any) {
    obj.opt = opt;
    this.modalCtrl.create({
      component: PublicacionPage,
      componentProps: {
        obj: obj
      }
    }).then(modal=>modal.present());
  }
  like(obj){
    if(!obj.check){
      obj.check = true;
      let query = {
        id: obj.id,
        megusta: obj.megusta++
      };
      return this._negocios.edit(query)
      .subscribe((res:any)=>{
        if(!res.id) return false;
        // console.log(res)
        let accion = new NegociosAction(obj, 'put');
        this._store.dispatch(accion);
      });
    }
  }

}
