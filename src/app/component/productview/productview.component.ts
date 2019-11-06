import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import * as _ from 'lodash';
import { CartAction, SearchAction } from 'src/app/redux/app.actions';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/service-component/producto.service';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.component.html',
  styleUrls: ['./productview.component.scss'],
})
export class ProductviewComponent implements OnInit {

  public data: any = {
    user:{}
  };
  public list_productos: any = [];

  @ViewChildren('slideWithNav') slideWithNav: IonSlides;
  @ViewChildren('slideWithNav2') slideWithNav2: IonSlides;
  @ViewChildren('slideWithNav3') slideWithNav3: IonSlides;
  @ViewChildren('slideWithNav4') slideWithNav4: IonSlides;
  @ViewChildren('slideWithNav5') slideWithNav5: IonSlides;
  public img = "./assets/imagenes/dilisap1.png";
  sliderOne: any;
  sliderTho: any = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems:Array()
  };
  sliderThree: any = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems:Array()
  };
  sliderFoor: any;
  sliderFive: any;
  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  slideOptsTho = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };
  slideOptsFoor = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };
  slideOptsFive = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _store: Store<ARTICULOS>,
    public toastController: ToastController,
    private _producto: ProductoService
  ) {
    this._store.select("name")
      .subscribe((store: any) => {
        console.log(store);
        this.list_productos = store.articulos;
      });
    this.init();
  }

  ngOnInit() {
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 2,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 3,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 4,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 5,
            image: './assets/imagenes/dilisap1.png'
          }
        ]
      };
  }
  init(){
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        return this.get_articulo(params.id)
        .subscribe((rta:any)=>{
          console.log(rta);
          this.data = rta.data[0];
          if(!this.data) return false;
          this.data.cantida_adquiridad = String(1);
          if (this.data.list_informacion.length === 0 ) this.data.informacion_articulo = [];
          // if (this.data.comentario.length === 0) this.data.comentario = [{ key: "none", value: "none" }];
          if (this.data.list_envios.length === 0) this.data.list_envios = [];
          // if (this.data.list_comentario_vendedor.length === 0) this.data.list_comentario_vendedor = [{ username: "pos_r", titulo: "Excelente", comentario: "genial vendedor" }];
          if (Object.keys(this.data.user).length === 0) this.data.user = {};
          this.data_referecencia_articulo();
        });
      }
    });
  }
  get_articulo(id:any){
    return this._producto.get({
      where: {
        id: id
      },
      limit: 1
    });
  }

  submit_cart(opt: any) {
    let data = this.data;
    if (!data.cantida_adquiridad) return this.presentToast('Erro por favor agregar una cantidad');;
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    if (opt === 'comprar') this.router.navigate(['chech']);
    else this.presentToast('Producto Agregado al Cart');
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'iontoast'
    });
    toast.present();
  }
  fn_favorito() {

  }
  data_referecencia_articulo(){
    return this._producto.get({
      where:{},
      sort: 'createdAt DESC'
    })
    .subscribe((res:any)=>{
      // console.log(res);
      this.sliderTho.slidesItems = _.orderBy(res.data, ['createdAt'], ['age']);
      this.sliderThree.slidesItems = _.orderBy(res.data, ['createdAt'], ['desc']);
    });
  }

  async data_chat(){
    let data:any = {
      id: this.data.id,
      titulo: this.data.titulo,
      costopromosion: this.data.costopromosion,
      costoventa: this.data.costoventa
    };
    console.log(this.data)
    let action = new SearchAction(data, 'post')
    this._store.dispatch(action);
    this.router.navigate(['/chat_view', this.data.user.id]);
  }



  // TODO FUNCIONES DEL SLIDER
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      if(object)object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      if(object)object.isEndSlide = istrue;
    });
  }

}
