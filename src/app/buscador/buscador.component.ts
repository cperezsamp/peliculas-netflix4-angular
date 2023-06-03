import { Component } from '@angular/core';
import { ActoresService } from '../actores.service';
import { Actor } from '../models/actor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})


export class BuscadorComponent {

  desplegable: boolean;
  nombreActor: string;
  edadMinima: number;
  edadMaxima: number;
  nacionalidad: string;
  write: boolean;
  actores: Actor[];
  icon: string;

  constructor(private actoresService: ActoresService) {
    this.desplegable = false;
    this.nombreActor = "";
    this.edadMinima = 0;
    this.edadMaxima = 150;
    this.nacionalidad = "";
    this.write = false;
    this.getActores();
    this.icon = "../assets/images/icons/down-arrow.png";
  }

  async getActores(){
    this.actoresService.getAll().subscribe(
      response =>{
        //console.log(response);
        this.actores= response;
      }
    );
  }
  changeDesplegable() {
    if (this.desplegable) {
      this.desplegable = false;
      this.icon = "../assets/images/icons/down-arrow.png";

    }
    else {
      this.desplegable = true;
      this.icon = "../assets/images/icons/up-arrow.png";
    }
  }

  onWrite() {
    if (this.nombreActor != "") {
      this.write = true;
    }
    else {
      this.write = false;
    }
  }

  onSubmit() {
    if (this.edadMinima >= 0 || this.edadMaxima > 0 || this.nacionalidad != "") {
      this.write = true;
    }
    else {
      this.write = false;
    }
  }

}
