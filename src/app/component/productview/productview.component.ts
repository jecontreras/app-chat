import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import * as _ from 'lodash';
import { CartAction, SearchAction } from 'src/app/redux/app.actions';
import { ProductoService } from 'src/app/service-component/producto.service';
import { ArchivoService } from 'src/app/service-component/archivo.services';
import { SubastasService } from 'src/app/service-component/subastas.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

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
  public ev:any = {};
  public disable_list:boolean = true;
  public data_user:any = {};
  public disable_data:boolean = true;
  public loading:any;

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
    private _producto: ProductoService,
    private _archivo: ArchivoService,
    private _subasta: SubastasService,
    public alertController: AlertController,
    public loadingController: LoadingController,
  ) {
    this._store.select("name")
      .subscribe((store: any) => {
        // console.log(store);
        this.data_user = store.user;
        this.list_productos = store.articulos;
      });
    this.init();
  }

  async ngOnInit() {
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: []
      };

       this.loading = await this.loadingController.create({
        spinner: 'crescent',
        message: 'Iniciando...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });

      await this.loading.present();
  }
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.init();
  }
  init(){
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        return this.get_articulo(params.id)
        .subscribe((rta:any)=>{
          console.log(rta);
          if(!rta.data[0]) return this.ocultar_disable()
          this.data = rta.data[0];
          this.data.precio_ofrece = this.data.costoventa;
          if(!this.data) return false;
          this.data.cantida_adquiridad = String(1);
          if (this.data.list_informacion.length === 0 ) this.data.informacion_articulo = [];
          else{
            let filtro =this.data.list_informacion.filter(row=>row.value); 
            this.data.list_informacion = filtro;
          }
          // if (this.data.comentario.length === 0) this.data.comentario = [{ key: "none", value: "none" }];
          if (this.data.list_envios.length === 0) this.data.list_envios = [];
          // if (this.data.list_comentario_vendedor.length === 0) this.data.list_comentario_vendedor = [{ username: "pos_r", titulo: "Excelente", comentario: "genial vendedor" }];
          if (Object.keys(this.data.user).length === 0) this.data.user = {};
          this.data_referecencia_articulo();
          this.get_galeria(this.data.id);
          this.get_ofertarlo();
          if(this.ev){
            this.disable_list = true;
            if(this.ev.target){
              this.ev.target.complete();
            }
          }
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
  async ofreciendo(){
    const alert = await this.alertController.create({
      header: 'Producto Subastando',
      inputs: [
        {
          name: 'valor',
          type: 'number',
          placeholder: 'Cuanto ofreces',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data.valor);
            if(data.valor){
              this.data.precio_ofrece = data.valor;
              this.ofertalo();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async ocultar_disable(){
    this.disable_data = false;
    const alert = await this.alertController.create({
      header: 'Lo sentimos',
      message: 'Producto no encontrado',
      buttons: ['Ok']
    });
    this.router.navigate(['/home']);
    await alert.present();
  }
  get_galeria(id){
    return this._archivo.get({
      where:{
        articulo: id,
        // opcion: 'activo'
      }
    })
    .subscribe((rta:any)=>{
      rta = rta.data[0];
      // console.log(rta);
      if(rta){
        this.sliderOne.slidesItems = rta.archivos;
      }else{
        this.sliderOne.slidesItems.push({id: 1, foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"})
      }
      this.loading.dismiss();
    },(err)=>{
      this.presentToast('Error galeria no encontrada');
      this.loading.dismiss();
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
      where:{
        id: { '!=' : this.data.id }
      },
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
    // console.log(this.data)
    let action = new SearchAction(data, 'post')
    this._store.dispatch(action);
    this.router.navigate(['/chat_view', this.data.user.id]);
  }
  async get_ofertarlo(){
    return this._subasta.get({
      where:{
        user: this.data_user.id,
        articulo: this.data.id
      },
      limit: 1
    }).subscribe((res:any)=>{
      res = res.data[0];
      if(res) this.data.disableoferta = true;
    });
  }
  async ofertalo(){
    let data:any = {
      articulo: this.data.id,
      user: this.data.user.id,
      creado: this.data_user.id,
      ofrece: this.data.precio_ofrece
    };
    if(!data.ofrece) this.presentToast('Por Favor Agregar un valor!');
    return this._subasta.saved(data).subscribe((rta:any)=>{
      // console.log(rta);
      if(rta.id){
        this.presentToast('Ofertado exitosamente!');
        this.data.disableoferta = true;
      }else{
        this.presentToast('ALgo salio mal!');
      }
    }, (err)=>{
      this.presentToast('ALgo salio mal!');
    });
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
