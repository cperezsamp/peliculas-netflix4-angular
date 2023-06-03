import { Component, OnInit } from '@angular/core';
import { Storage, listAll, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';


@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadfileComponent {
  
  constructor( private storage: Storage){}

  upload($event :any){
    const image= $event.target.files[0];
    console.log(image);
    const reference= ref(this.storage, `assets/images/films/${image.name}`);  //referencia a la imagen
    uploadBytes(reference, image)
    .then(
      //guardar response.fullPath en el campo imagen de la pelicula en la base de datos??
      response => console.log(response)
    )
    .catch(error => console.log(error))
  }

  
    
}
