import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { ArticulosAction, CategoriaAction } from 'src/app/redux/app.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/service-component/producto.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CategoriaService } from 'src/app/service-component/categoria.service';
import { ColorService } from 'src/app/service-component/color.services';
import { ArchivoService } from 'src/app/service-component/archivo.services';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  evento: any = {};
  myForm_product: FormGroup;

  public loginForm: FormGroup;
  public url: any = ``;
  public clone: any = {};
  public m: any = '';
  public data:any = {};
  public data_user:any;
  public disable_button:boolean = true;
  public data_img:any = [];
  public options:any;

  @ViewChildren('slideWithNav') slideWithNav: IonSlides;
  sliderOne: any;
  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  public list_categoria:any=[];
  public list_marca:any=[];
  public list_color:any=[];
  public imageResponse:any = [];
  public list_opciones:any=[
    {
      id: 'activo',
      tipo: 'Disponible'
    },
    {
      id: 'inactivo',
      tipo: 'Inactivo'
    }
  ];

  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _store: Store<ARTICULOS>,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private _Articulo: ProductoService,
    private imagePicker: ImagePicker,
    private router: Router,
    private _categoria: CategoriaService,
    private _color: ColorService,
    private _archivo: ArchivoService,
  ) { 
    this.evento = this.navparams.get('obj');

    this._store.select("name")
    .subscribe((store:any)=>{
      this.data_user = store.user;
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0){
        this.router.navigate(['login']);
      }
      if(Object.keys(store.categoria).length === 0) { this.get_cateogria(); this.get_marca(); this.get_color() }
      else {
        this.list_categoria = store.categoria.filter(row=>row.categoriaDe === 'producto');
        this.list_marca = store.categoria.filter(row=>row.categoriaDe === 'marca');
        this.list_marca = store.categoria.filter(row=>row.categoriaDe === 'color');
      }
    });

    this.deta_init();
    
    if(this.evento){
      this.url = this.evento.foto;
      this.data = this.evento;
      this.get_galeria(this.evento.id);
      this.myForm_product.patchValue(this.evento);
    }

    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: []
    };
  }

  ngOnInit() {
    if(!this.data.id){
      this.getImages();
    }
  }
  deta_init(){
    this.myForm_product = this.createMyForm();
    
    this.data = {
      list_informacion: [
        {
          key: 'Descripcion del color'
        },
        {
          key: 'Descripcion de la marca'
        },
        {
          key: 'Detalles',
          value: '0 detalles'
        },
        {
          key: 'Material del Producto'
        },
        {
          key: 'Años de Uso / Estado',
          value: 'nuevo'
        }
      ],
      list_envios: [
        {
          key: 'Envios',
          values: 'Envios a Todo el Pais'
        },
        {
          key: 'Valor del Envio',
          value: 'Contra entrega'
        },
        {
          key: 'Linea de Envio'
        }
      ],
      list_galeria: Array()
    };
  }
  get_galeria(id){
    return this._archivo.get({
      where:{
        articulo: id
      }
    })
    .subscribe((rta:any)=>{
      rta = rta.data[0];
      // console.log(rta);
      if(rta){
        this.sliderOne.slidesItems = rta.archivos;
      }
    });
  }
  get_cateogria(){
    return this._categoria.get({
      where:{
        estado: 'activo',
        categoriaDe: ['producto', 'otro']
      },
      limit: -1
    })
    .subscribe((res:any)=>{
      for(let row of res.data){
        let idx = this.list_categoria.find(item => item.id == row.id);
        if(!idx){
          let accion:any = new CategoriaAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_categoria = res.data
    });
  }
  get_marca(){
    return this._categoria.get({
      where:{
        estado: 'activo',
        categoriaDe: ['marca', 'otro']
      },
      limit: -1
    })
    .subscribe((res:any)=>{
      for(let row of res.data){
        let idx = this.list_categoria.find(item => item.id == row.id);
        if(!idx){
          let accion:any = new CategoriaAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_marca = res.data
    });
  }
  get_color(){
    return this._color.get({
      where:{
        estado: ['activo', 'otro'],
      },
      limit: -1
    })
    .subscribe((res:any)=>{
      for(let row of res.data){
        let idx = this.list_categoria.find(item => item.id == row.id);
        if(!idx){
          row.categoriaDe = 'color';
          let accion:any = new CategoriaAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_color = res.data
    });
  }

  view_image(ev){
    let 
      file = ev.target.files,
      imageType = /image.*/
    ;
    // if (!file.type.match(imageType)) return;
    console.log(file);
    for(let row of file){
      this.data_img.push(
        row
      );
    }
    this.subir_img();
    // var reader = new FileReader();
    // reader.onload = async (e)=>{
    //   var result=e.target.result;
    // };
    // this.m = reader.readAsDataURL(file);
    // console.log(this.m )
  }

  abrirGaleria(){
    let options: ImagePickerOptions = {
      maximumImagesCount: 3
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          this.data_img.push(
            `data:image/jpeg:base64,`+results[i]
          );
      }
      this.subir_img();
    }, (err) => { });
  }

  subir_img(){
    let data:any ={
      img: this.data_img
    };
    return this._archivo.saved(data)
    .subscribe((res:any)=>{
      console.log(res);
    });
  }

  createMyForm(){
    return this.formBuilder.group({
      "titulo": ['', Validators.required],
      "subasta": [false, Validators.required],
      "opcion": ['activo', Validators.required],
      "categoria": ['', Validators.required],
      "color": ['', Validators.required],
      "marca": ['', Validators.required],
      "descripcion": ['', Validators.required],
      "codigo": [this.codigo(), Validators.required],
      "slug": ['', Validators.required],
      "cantidad": [0, Validators.required],
      "peso": [0, Validators.required],
      "estado": ['nuevo', Validators.required],
      "costopromosion": [0, Validators.required],
      "costoventa": [0, Validators.required],
      "user": [ this.data_user.id, Validators.required],
    });
  }
  codigo(){
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase(); 
  }
  submit(){
    let data:any = this.myForm_product.value;
    data.list_informacion = this.data.list_informacion;
    data.list_envios = this.data.list_envios;
    data.list_galeria = this.data.list_galeria;
    this.disable_button = false;
    data = _.omitBy(data, row=> row == '');
    this._Articulo.saved(data)
    .subscribe((res:any)=>{
      console.log("*********",res);
      let accion:any = new ArticulosAction(res, 'post');
      this._store.dispatch(accion);
      this.myForm_product = this.createMyForm();
      this.disable_button = true;
      this.data = res;
    },(error)=>{
      this.disable_button = true;
      alert("Error");
    });
  }

  async editar(){
    let data = this.myForm_product.value;
    if(!this.evento.id) return false;
    data.id = this.evento.id;
    data.list_informacion = this.data.list_informacion;
    data.list_envios = this.data.list_envios;
    data.list_galeria = this.data.list_galeria;
    this.disable_button = false;
    data = _.omitBy(data, row=> row == '' || row == null);
    delete data.user;
    this._Articulo.edit(data)
    .subscribe(async(rta:any)=>{
      // console.log(rta);
      let accion = new ArticulosAction(rta, 'put');
      this._store.dispatch(accion);
      const toast = await this.toastController.create({
        message: 'Actualizado.',
        duration: 2000
      });
      
      toast.present();
      this.disable_button = true;
    });
  }

  getImages() {
    this.options = {
      maximumImagesCount: 6,
      width: 128,
      height: 215,
      quality: 50,
      outputType: 1
    };
    this.imageResponse = [];
    this.sliderOne.slidesItems = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
        this.sliderOne.slidesItems.push({
          id: i,
          foto: 'data:image/jpeg;base64,' + results[i]
        });
      }
    }, (err) => {
      alert(err);
    });
  }
  uploadImage(){
    let data = this.myForm_product.value;
    data.id = this.evento.id;
    data.opt_archivo = 'articulo';
    this._archivo.upload(this.imageResponse, data).then(()=>{
      alert("Exitoso");
      this.get_galeria(data.id);
    });
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
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
