import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ARTICULOS } from 'src/app/redux/interfax/articulos';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  public list_categoria_global: any = [{
    product: Array()
  }];
  constructor(
    private _store: Store<ARTICULOS>,
  ) { 
    this._store.select("name")
    .subscribe((store:any)=>{
      this.list_categoria_global = [
        {
          titulo: "Ofertas destacadas",
          product: store.articulos
        },
      ];
    });


  }

  ngOnInit() {}

}
