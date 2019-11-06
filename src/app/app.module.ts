import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ProductosComponent } from './component/product/productos.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environemnt
import { StoreModule } from '@ngrx/store';
import { appReducer } from './redux/app';
import { ProductoPageModule } from './dialog/form/producto/producto.module';
import { CategoriasComponent } from './component/categorias/categorias.component';
import { ProductviewComponent } from './component/productview/productview.component';
import { ChequiarComponent } from './component/chequiar/chequiar.component';
import { ChatComponent } from './component/chat/chat.component';
import { ChatViewComponent } from './component/chat-view/chat-view.component';
import { NotificacionesComponent } from './component/notificaciones/notificaciones.component';
import { SubastasComponent } from './component/subastas/subastas.component';
import { RegistroComponent } from './logeo/registro/registro.component';
import { LoginComponent } from './logeo/login/login.component';
import { ListproductComponent } from './component/listproduct/listproduct.component';

// plugin
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FactoryModelService } from './services/factory.model.service';
import { PerfilComponent } from './component/perfil/perfil.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';


@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    CategoriasComponent,
    ProductviewComponent,
    ChatViewComponent,
    NotificacionesComponent,
    SubastasComponent,
    ChequiarComponent,
    LoginComponent,
    RegistroComponent,
    ListproductComponent,
    PerfilComponent,
    ChatComponent
  ],
  entryComponents: [
  ],
  exports:[
  ],
  imports: [
    HttpClientModule,
    StoreModule.forRoot({ name: appReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    BrowserModule,
    RouterModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProductoPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImagePicker
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

    constructor(
      private _mode: FactoryModelService
    ){
      // this._mode.conectionSocket();
    }
}
