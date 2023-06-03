import { Component, Input, OnInit } from '@angular/core';
import { ActoresService } from '../actores.service';
import { Personaje } from '../models/personaje';
import { PersonajesService } from '../personajes.service';
import { Actor } from '../models/actor';
import { Pelicula } from '../models/pelicula';


@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {
  @Input() findActor: Actor;
  actor: Actor; 
  isVisible: Boolean;
  isEditing: Boolean;

  constructor(private actoresService: ActoresService, private personajesService: PersonajesService) {
  }

  ngOnInit(): void {
    //this.actoresService.findOneById(this.personaje.actor.id).then((obj: any) => { this.actor = new Actor(obj.id, obj.nombre, obj.edad, obj.clip, obj.nacionalidad, obj.vivo, obj.imagen) });
    this.actoresService.findOneById(this.findActor.id).then(
      (obj: any) => 
      { 
        this.actor = new Actor(this.findActor.id, obj.nombre, obj.edad, obj.clip, obj.nacionalidad, obj.vivo, obj.imagen) 
      });
    this.isVisible = false;
    this.isEditing = false;
  }

  /*  loadPersonajes() {
     this.personajesService.getAll().subscribe(
       personajes => {
         this.personajes = personajes;
       }
     )
   } */

  /* loadActores() {
    this.actoresService.getAll().subscribe(
      actores => {
        this.actores = actores;
      }
    )
  } */

  /*   searchPersonajes(pelicula: Pelicula) {
      this.loadPersonajes();
      for (let personaje of this.personajes) {
        if (personaje.pelicula.id == pelicula.id) {
          this.personajesPelicula.push(personaje);
        }
      }
    } */


  onClick() {
    this.isVisible = !this.isVisible;
  }

  delete() {
    this.actoresService.delete(this.actor);
  }

  editPersonaje() {
    this.isEditing = !this.isEditing
  }

}
