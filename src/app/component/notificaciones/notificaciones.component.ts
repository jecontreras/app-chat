import { Component, OnInit, ViewChild, ViewChildren  } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { NOTIFICACIONES } from 'src/app/redux/interfax/notificaciones';
import { NotificacionService } from 'src/app/service-component/notificacion.service';
import { Router } from '@angular/router';
import { NotificacionesAction } from 'src/app/redux/app.actions';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  public list_notificacion:any = [];
  public ev:any = {};
  public disable_list:boolean = true;

  @ViewChildren('slideWithNav') slideWithNav: IonSlides;
  @ViewChildren('slideWithNav2') slideWithNav2: IonSlides;
  @ViewChildren('slideWithNav3') slideWithNav3: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;

   //Configuration for each Slider
   slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3
  };
  public data_user:any = {};

  constructor(
    private _store: Store<NOTIFICACIONES>,
    private _notificaion: NotificacionService,
    private router: Router
  ) { 
    this._store.select("name")
    .subscribe((store:any)=>{
      // console.log(store, this.list_notificacion);
      this.data_user = store.user;
        if(Object.keys(this.data_user).length ===0){
          this.router.navigate(['login']);
        }
      if(Object.keys(store.notificaciones).length > 0) this.list_notificacion = store.notificaciones;
      else this.get_notificacion();
    });
  }

  ngOnInit() {
    //Item object for Nature
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
    //Item object for Food
    this.sliderTwo =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 6,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 7,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 8,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 9,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 10,
            image: './assets/imagenes/dilisap1.png'
          }
        ]
      };
    //Item object for Fashion
    this.sliderThree =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 11,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 12,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 13,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 14,
            image: './assets/imagenes/dilisap1.png'
          },
          {
            id: 15,
            image: './assets/imagenes/dilisap1.png'
          }
        ]
      };
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.get_notificacion();
  }

  async get_notificacion(){
    return this._notificaion.get({})
    .subscribe((rta:any)=>{
      console.log(rta);
      if(this.ev){
        this.disable_list = true;
        if(this.ev.target){
          this.ev.target.complete();
        }
      }
      for(let row of rta.data){
        let idx = this.list_notificacion.find((item:any) => item.id == row.id);
        if(!idx){
          let accion:any = new NotificacionesAction(row, 'post');
          this._store.dispatch(accion);
        }
      }
      this.list_notificacion = rta.data;
    });
  }
  view(item){
    if(item.tipo === 'chat'){
      this.router.navigate(['/chat_view', item.reseptor]);
    }
  }

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
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }



}
