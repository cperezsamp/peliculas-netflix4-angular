import { Actor } from './actor';
import { Pelicula } from './pelicula';

export class Personaje {
    actor: Actor;
    pelicula: Pelicula;
    nombrePersonaje: string;
    descripcion: string;
    id: string;
    imagen: string;

    constructor(actor: Actor, pelicula: Pelicula, nombrePersonaje: string, descripcion: string, imagen: string, id: string) {
        this.actor = actor;
        this.pelicula = pelicula;
        this.nombrePersonaje = nombrePersonaje;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.id= id;
    }

}
