import { Injectable } from '@angular/core';
import { Storage, listAll, ref, uploadBytes, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { reduce } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor(private storage: Storage, private sanitizer: DomSanitizer){ }


  //hay que impotar listAll para poder listar el contenido de la carpeta remota y getDownloadURL para poder ver la url de cada fichero
  getAllImages(): StorageReference[]{
    let imagesArray :StorageReference[]= [];
    const images= ref(this.storage, 'assets/images/films');
    listAll(images)
    .then( async response => {
        for (let item of response.items){
          //const url =  await getDownloadURL(item);  //tiene que estar con a la espera para funcionar y la funcion anonima como async
          imagesArray.push(item);
        }
      }
    ) 
    .catch( error => console.log(error))
    return imagesArray;
  }


  async getAllImagesActors(): Promise<StorageReference[]>{
    let imagesArray :StorageReference[]= [];
    const images= ref(this.storage, 'assets/images/actores');
    listAll(images)
    .then( async response => {
        for (let item of response.items){
          //const url =  await getDownloadURL(item);  //tiene que estar con a la espera para funcionar y la funcion anonima como async
          imagesArray.push(item);
        }
      }
    ) 
    .catch( error => console.log(error))
    return imagesArray;
  }

  getAllClips(): StorageReference[]{
    let clipsArray :StorageReference[]= [];
    const clips= ref(this.storage, 'media/');
    listAll(clips)
    .then( async response => {
        for (let item of response.items){
          //const url =  await getDownloadURL(item);  //tiene que estar con a la espera para funcionar y la funcion anonima como async
          clipsArray.push(item);
        }
      }
    ) 
    .catch( error => console.log(error))
    return clipsArray;
  }
  


}
