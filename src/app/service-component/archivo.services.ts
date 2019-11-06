import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FactoryModelService } from '../services/factory.model.service';
import { GLOBAL } from './../services/global';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  constructor(
    private _model: FactoryModelService,
    private transfer: FileTransfer
  ) {
  }
  get(query: any){
    return this._model.query('archivo', query);
  }
  saved (query: any){
    let postData = new FormData();
    for(let row of query.img){
      row.img = postData.append('file', row);
    }
    console.log(query);
    return this._model.create('galeria/file', query);
  }

  async upload(file_array:any){
    let FileTransfer: FileTransferObject = this.transfer.create();

    let random = Math.floor(Math.random() * 100);

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_"+ random + ".jpg",
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/jpeg",
      headers: {}
    };
    console.log(GLOBAL.url+"galeria/file");
    for(let row of file_array){
      let result = await FileTransfer.upload(row, GLOBAL.url+"galeria/file", options);
    }

  }

}