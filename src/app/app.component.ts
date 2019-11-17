import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Store } from '@ngrx/store';
import { USER } from './redux/interfax/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Notificaciones',
      url: '/notificacion',
      icon: 'notifications-outline'
    },
    {
      title: 'Mensajes',
      url: '/chat',
      icon: 'mail-unread'
    }
  ];
  public appTienda = [
    {
      title: 'Productos',
      url: '/product',
      icon: 'filing'
    },
    {
      title: 'Anuncios',
      url: '/chat',
      icon: 'megaphone'
    },
    {
      title: 'Subastas',
      url: '/subastas',
      icon: 'hammer'
    },
    {
      title: 'Negocios',
      url: '/negocios',
      icon: 'contacts'
    }
  ];
  public data:any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _store: Store<USER>
  ) {
    this.initializeApp();

    this._store.select("name")
    .subscribe((store:any)=>{
      console.log(store);
      this.data = store.user || {};
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
