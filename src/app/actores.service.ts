import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Actor } from './models/actor';

@Injectable({
  providedIn: 'root'
})
export class ActoresService {

  //CON FIREBASE

  constructor(private firestore: Firestore) {  //inyectar firestore para utilizarlo

  }


  //añadir actores
  async add(actor: object) {
    const coleccion = collection(this.firestore, 'actores');  //utilizamos el objeto collection para indicar la coleccion, recibe como argumento el objeto firestore inyectado y el nombre del documento
    const docRef = await addDoc(coleccion, actor); //con el objeto addDoc guardamos en la base de datos, recibe el nombre de la coleccion y el objeto a guardar
    return docRef;
  }

  //obtener actores
  getAll(): Observable<Actor[]> {  //nos devolvera un observable que esta mirando el estado de la base de datos.
    const coleccion = collection(this.firestore, 'actores'); //indicamos la colecion
    return collectionData(coleccion, { idField: 'id' }) as Observable<Actor[]>;  //utilizamos el objeto collectionData que recupera datos, le indicamos la coleccion 
    // y el campo por el que vamos a ordenar la busqueda, en esete caso id, finalment lo casteamos al tipo Observable que hemos indicado que retorna esta funcion.
  }

  //obtener un actor por su id
  async findOneById(id: string) {
    const docRef = doc(this.firestore, 'actores', id);
    const docSnap = await getDoc(docRef);
    const data = docSnap?.data()
    return data
  }

  //obtener un actor por su id
  getOneById(actor: Actor) {
    return doc(this.firestore, `actores/${actor.id}`);
  }

  //Realizar una query sencilla con una propiedad y valor
  async queryDoc(property: string, value: string) {
    const q = query(collection(this.firestore, 'actores'), where(property, "==", value));
    const querySnapshot = await getDocs(q);
    let data = {};
    querySnapshot.forEach((doc) => {
      data = doc.data()
    })
    return data
  }

  //eliminar un actor
  delete(actor: Actor) {
    const documento = doc(this.firestore, `actores/${actor.id}`); //indicamos el documento con el objeto doc. Este recibe como argumento el objeto firestore y una cadena formada por "nombre coleccion/identificador documento"
    return deleteDoc(documento); //eliminamos el documento anterior con el objeto deleteDoc
  }

  //update actor, OK, ojo a las comillas, son acentos
  update(actor: Actor) {
    const documento = doc(this.firestore, `actores/${actor.id}`);
    return updateDoc(documento, { clip: actor.clip, edad: actor.edad, imagen: actor.imagen, nacionalidad: actor.nacionalidad, nombre: actor.nombre, vivo: actor.vivo });
  }




  //EN LOCAL

  actores: Actor[] = [];

  /*constructor() {

    this.actores.push(new Actor(1, "Clark Gable", 59, "clip.mp4", "estadounidense", false, "assets/images/actors/clarkgable.jpeg"));
    this.actores.push(new Actor(2, "Vivien Leigh", 53, "clip2.mp4", "britanica", false, "assets/images/actors/vivienleight.jpeg"));
    this.actores.push(new Actor(3, "Leslie Howard", 50, "clip3.mp4", "britanica", false, "assets/images/actors/lesliHoward.jpeg"));
    this.actores.push(new Actor(4, "Olivia de Havilland", 104, "clip4.mp4", "estadounidense", false, "assets/images/actors/oliviadehavillan.jpeg"));
    this.actores.push(new Actor(5, "Marlon Brando", 80, "clip.mp4", "estadounidense", false, "assets/images/actors/marlonbrando.jpeg"));
    this.actores.push(new Actor(6, "Al Pacino", 82, "clip2.mp4", "estadounidense", true, "assets/images/actors/alpacino.jpeg"));
    this.actores.push(new Actor(7, "Robert Duvall", 92, "clip3.mp4", "estadounidense", true, "assets/images/actors/roberduvall.jpeg"));
    this.actores.push(new Actor(8, "James Caan", 82, "clip4.mp4", "estadounidense", false, "assets/images/actors/jamescaan.jpeg"));
    this.actores.push(new Actor(9, "Tom Cruise", 60, "clip.mp4", "estadounidense", true, "assets/images/actors/tomcruise.jpeg"));
    this.actores.push(new Actor(10, "Miles Teller", 36, "clip2.mp4", "estadounidense", true, "assets/images/actors/milesteller.jpeg"));
    this.actores.push(new Actor(11, "Jon Hamm", 52, "clip3.mp4", "estadounidense", true, "assets/images/actors/jonhamm.jpeg"));
    this.actores.push(new Actor(12, "Jennifer Connelly", 52, "clip4.mp4", "estadounidense", true, "assets/images/actors/jenniferconnelly.jpeg"));

  }*/

  findByName(name: string): Actor {
    return this.actores.find(element => element.nombre === name) as Actor
  }

  /*   //esto no devuelve nada
    findOneById(id: string): Actor {
      for(let i= 0; i<this.actores.length;i++){
        if(this.actores[i].id=== id){
          return this.actores[i];
        }
      }
      return null as Actor;
  
      console.log('actor id', id);
      console.log(this.actores.find(element => element.id === id) as Actor);
      return this.actores.find(element => element.id == id) as Actor;
    } */

}
