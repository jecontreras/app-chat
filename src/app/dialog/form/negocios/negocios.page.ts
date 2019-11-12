import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';
import { paises } from 'src/app/JSON/paises';
import { departamento } from 'src/app/JSON/departamentos';
import { ModalController, NavParams, IonSlides } from '@ionic/angular';
import { NegociosService } from 'src/app/service-component/negocios.services';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NegociosAction } from 'src/app/redux/app.actions';
import { ArchivoService } from 'src/app/service-component/archivo.services';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  public evento: any = {};
  public data:any = {};
  public myForm_negocios:any;
  public data_user:any;
  public list_paise:any = paises;
  public list_departamento:any = departamento;
  public list_ciudad:any = [];
  public disabledpais:boolean = true;
  public disable_button:boolean = true;
  public imageResponse:any = [];
  public options:any;


  @ViewChildren('slideWithNav') slideWithNav: IonSlides;
  sliderOne: any;
  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private router: Router,
    public formBuilder: FormBuilder,
    private _negocios: NegociosService,
    private _store: Store<ARTICULOS>,
    private _archivo: ArchivoService,
    private imagePicker: ImagePicker,
  ) {
    
    this.evento = (this.navparams.get('obj')) || {};
    console.log(this.evento);
    this._store.select("name")
    .subscribe((store:any)=>{
      this.data_user = store.user;
      // Validar si el Usuario esta Logueado
      if(Object.keys(this.data_user).length ===0){
        this.router.navigate(['login']);
      }
    });
    this.myForm_negocios = this.createMyForm();

    if(this.evento){
      this.data = this.evento;
      this.get_galeria(this.evento.id);
      this.myForm_negocios.patchValue(this.evento);
    }

    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            foto: './assets/imagenes/dilisap1.png'
          },
          {
            id: 2,
            foto: './assets/imagenes/dilisap1.png'
          }
        ]
    };
   }

  ngOnInit() {
  }
  createMyForm(){
    return this.formBuilder.group({
      "titulo": ['', Validators.required],
      "descripcion": ['', Validators.required],
      "pais": ['Colombia', Validators.required],
      "departamento": ['', Validators.required],
      "ciudad": ['', Validators.required],
      "user": [this.data_user.id, Validators.required],
      "direccion": ['', Validators.required],
    });
  }
  get_galeria(id){
    return this._archivo.get({
      where:{
        negocios: id
      }
    })
    .subscribe((rta:any)=>{
      rta = rta.data[0];
      console.log(rta);
      if(rta){
        this.sliderOne.slidesItems = rta.archivos;
      }
    });
  }

  viewpais() {
    const
      data: any = this.myForm_negocios.value
    ;
    this.disabledpais = false;
    if (data.pais === 'Colombia') {
      this.disabledpais = true;
    }

  }
  blurdepartamento() {
    // console.log(this.registerForm.value);
    const data: any = this.myForm_negocios.value;
    let idx: any = 0;
    idx = _.findIndex(this.list_departamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      this.list_ciudad = this.list_departamento[idx].ciudades;
    }
  }
  submit(){
    let data:any = this.myForm_negocios.value;
    console.log(data);
    return this._negocios.saved(data)
    .subscribe((res:any)=>{
      console.log("*********",res);
      let accion:any = new NegociosAction(res, 'post');
      this._store.dispatch(accion);
      this.myForm_negocios = this.createMyForm();
      this.disable_button = true;
      this.data = res;
    },(error)=>{
      this.disable_button = true;
      alert("Error");
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
      }
      if(Object.keys(this.imageResponse).length  > 0) this.uploadImage();
    }, (err) => {
      alert(err);
    });
  }
  uploadImage(){
    let data = this.myForm_negocios.value;
    data.id = this.evento.id;
    data.opt_archivo = 'negocios';
    this._archivo.upload(this.imageResponse, data).then(()=>{
      alert("Exitoso");
      this.get_galeria(data.id);
    });
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
