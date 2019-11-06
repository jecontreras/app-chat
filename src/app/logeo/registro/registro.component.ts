import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { USER } from 'src/app/redux/interfax/user';
import { Router } from '@angular/router';
import { UserAction } from 'src/app/redux/app.actions';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {

  public myForm_login: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private _userService: UserService,
    private _authSrvice: AuthService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private _store: Store<USER>,
    private router: Router,
  ) {
    this.myForm_login = this.create_form();
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() { }

  create_form() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      codigo: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirpassword: ['', Validators.required],
      acceso: ['celular', Validators.required],
    });
  }

  async submit_login() {
    let data = this.myForm_login.value;
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Iniciando...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this._userService.register(data).subscribe(
      async (response: any) => {
        loading.dismiss();
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.data));
          let accion: any = new UserAction(response.data, 'post');
          this._store.dispatch(accion);
          this.router.navigate(['home']);
        }else{
          const toast = await this.toastController.create({
            message: response.mensaje,
            duration: 2000
          });
          toast.present();
        }
      });

  }
}
