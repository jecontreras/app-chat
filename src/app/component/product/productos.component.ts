import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { ArticulosAction } from 'src/app/redux/app.actions';
import { ModalController } from '@ionic/angular';
import { ProductoPage } from '../../dialog/form/producto/producto.page';
import { ProductoService } from 'src/app/service-component/producto.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  public list_product: any = [];
  public data_user:any = {};
  public searchtxt:any;
  public ev:any = {};
  public disable_list:boolean = true;
  
  constructor(
    private _store: Store<ARTICULOS>,
    private modalCtrl: ModalController,
    private _producto: ProductoService,
    private router: Router,
  ) { 

    this._store.select("name")
    .subscribe((store:any)=>{
      console.log(store);
      this.data_user = store.user;
      this.list_product = store.articulos; 
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0){
        this.router.navigate(['login']);
      }
    });
    if(Object.keys(this.list_product).length === 0){
      // Get de Productos
      this.get_productos();
    }
  }

  ngOnInit() {
  }
  async get_productos(){
    return this._producto.get({
      where:{
        // user: this.data_user.id
      }
    }).subscribe((articulo:any)=>{
      articulo = articulo.data;
      console.log(articulo);
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      for(let row of articulo){
        let idx = this.list_product.find(item => item.id == row.id);
        if(!idx){
          let accion:any = new ArticulosAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_product = articulo;
    });
  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_productos();
  }

  open_form(obj) {
    this.modalCtrl.create({
      component: ProductoPage,
      componentProps: {
        obj: obj
      }
    }).then(modal=>modal.present());
  }

  search(){
    this.list_product.filter(row=>row.titulo >= this.searchtxt);
    // console.log(this.searchtxt, this.list_product);
  }

}
