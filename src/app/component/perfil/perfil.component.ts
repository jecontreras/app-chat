import { Component, OnInit } from '@angular/core';
import { USER } from 'src/app/redux/interfax/user';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { UserService } from 'src/app/services/user.service';
import { async } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  
  public data_user:any;
  public clone:any;

  constructor(
    private _store: Store<USER>,
    private router: Router,
    private _user: UserService,
    public toastController: ToastController,
  ) { 

    this._store.select('name')
    .subscribe((store:any)=>{
      this.data_user = store.user;
      this.clone = _.clone(store.user);
      if(Object.keys(this.data_user).length ===0){
        this.router.navigate(['login']);
      }
    });

  }

  ngOnInit() {}
  
  blur(obj){
    if((this.data_user[obj] !== this.clone[obj]) || obj === 'todo'){
      let query:any = {
        id: this.data_user.id
      };
      if(obj === 'todo') {
        query = _.omit(this.data_user, ['rol']);
      }
      else query[obj]=this.data_user[obj];
      this._user.update(query)
      .subscribe(async(res:any)=>{
        // console.log(res);
        const toast = await this.toastController.create({
          message: 'Actualizado.',
          duration: 2000
        });
        toast.present();
      });
    }
  }

}
