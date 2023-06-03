import { Injectable } from '@angular/core';
import { Pelicula } from './models/pelicula';
import { ActoresService } from './actores.service';
import { Personaje } from './models/personaje';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  //CON FIRESTORE
  constructor(private firestore: Firestore) {  //inyectar firestore para utilizarlo

  }

  //añadir peliculas
  add(pelicula: Pelicula) {
    const coleccion = collection(this.firestore, 'peliculas');  //utilizamos el objeto collection para indicar la coleccion, recibe como argumento el objeto firestore inyectado y el nombre del documento
    return addDoc(coleccion, {anyo: pelicula.anyo, argumento: pelicula.argumento, duracionHoras: pelicula.duracionHoras, duracionMinutos: pelicula.duracionMinutos, 
    image: pelicula.image, titulo: pelicula.titulo} ); //con el objeto addDoc guardamos en la base de datos, recibe el nombre de la coleccion y el objeto a guardar
  }

  //obtener peliculas
  getAll(): Observable<Pelicula[]> {  //nos devolvera un observable que esta mirando el estado de la base de datos.
    const coleccion = collection(this.firestore, 'peliculas'); //indicamos la colecion
    return collectionData(coleccion, { idField: 'id' }) as Observable<Pelicula[]>;  //utilizamos el objeto collectionData que recupera datos, le indicamos la coleccion 
    // y el campo por el que vamos a ordenar la busqueda, en esete caso id, finalment lo casteamos al tipo Observable que hemos indicado que retorna esta funcion.
  }



  //obtener una pelicula por su id
  getOneById(pelicula: Pelicula) {
    return doc(this.firestore, `peliculas/${pelicula.id}`);
  }

  //eliminar una pelicula
  delete(pelicula: Pelicula) {
    const documento = doc(this.firestore, `peliculas/${pelicula.id}`); //indicamos el documento con el objeto doc. Este recibe como argumento el objeto firestore y una cadena formada por "nombre coleccion/identificador documento"
    return deleteDoc(documento); //eliminamos el documento anterior con el objeto deleteDoc
  }

  //update pelicula, OK, ojo a las comillas, son acentos
  update(pelicula: Pelicula) {
    const documento = doc(this.firestore, `peliculas/${pelicula.id}`);
    console.log('pelicula updated', pelicula);
    return updateDoc(documento, { ...pelicula });
  }


}
