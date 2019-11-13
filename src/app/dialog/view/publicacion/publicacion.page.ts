import { Component, OnInit, ViewChildren } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { ArchivoService } from 'src/app/service-component/archivo.services';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  public evento:any = {};

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
    private _archivo: ArchivoService,
    private navparams: NavParams,
  ) { 
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
    this.evento = (this.navparams.get('obj')) || {};
    if(Object.keys(this.evento).length === 0) this.cerrarModal();
    this.get_galeria(this.evento.id);
  }

  ngOnInit() {
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
