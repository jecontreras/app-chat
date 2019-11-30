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
import { LoadingController, ToastController } from '@ionic/angular';

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
  public loading:any;


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
    public toastController: ToastController,
    private imagePicker: ImagePicker,
    public loadingController: LoadingController,
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

    if(Object.keys(this.evento).length > 0){
      this.data = this.evento;
      this.get_galeria(this.evento.id);
      this.myForm_negocios.patchValue(this.evento);
    }

    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: []
    };

   }

   async ngOnInit() {
    if(!this.data.id){
      this.getImages();
    }
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
      // console.log(rta);
      if(rta){
        this.sliderOne.slidesItems = rta.archivos;
      }else{
        this.sliderOne.slidesItems.push({id: 1, foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"})
      }
      // this.loading.dismiss();
    },(err)=>{
      // this.loading.dismiss();
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
  async submit(){
    let data:any = this.myForm_negocios.value;
    console.log(data);
    if(!data.titulo) {
      const toast = await this.toastController.create({
        message: "Por favor llenar formulario",
        duration: 2000
      });
      toast.present();
      return false;
    }
    return this._negocios.saved(data)
    .subscribe((res:any)=>{
      console.log("*********",res);
      let accion:any = new NegociosAction(res, 'post');
      this._store.dispatch(accion);
      // this.myForm_negocios = this.createMyForm();
      this.disable_button = true;
      this.data = res;
      this.evento = res;
      if(this.imageResponse.length >0)this.uploadImage();
    },(error)=>{
      this.disable_button = true;
      alert("Error");
    });
  }
  getImages() {
    this.options = {
      maximumImagesCount: 6,
      width: 300,
      height: 600,
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
    let data = this.myForm_negocios.value;
    data.id = this.evento.id;
    data.opt_archivo = 'negocios';
    this._archivo.upload(this.imageResponse, data).then(()=>{
      if(this.imageResponse.length >0)alert("Exitoso");
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
