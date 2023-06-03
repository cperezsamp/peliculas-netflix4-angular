import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../models/pelicula';
import { Personaje } from '../models/personaje';
import { Actor } from '../models/actor';

import { PeliculasService } from '../peliculas.service';
import { PersonajesService } from '../personajes.service';
import { ActoresService } from '../actores.service';
import { FormsModule } from '@angular/forms';
import { Storage, listAll, ref, uploadBytes, getDownloadURL, StorageReference, uploadBytesResumable } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../storage.service';
import { MessagingService } from '../messaging-service';



@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.css']
})
export class PeliculasComponent implements OnInit {
  peliculas: Pelicula[];
  editar: boolean = false;
  tituloForm: string;
  anyoForm: number;
  duracionHForm: number;
  duracionMForm: number;
  overviewForm: string;
  imageForm: any;
  $event: any;
  $eventClip: any;
  previsualizacion: string = "";
  imagesRefs: StorageReference[];
  clipsRefs: StorageReference[];

  actores: Actor[];
  //variables para enviar mensaje de comprobacion

  //variables formulario agregacion pelicula
  agregar: boolean = false;
  newTitulo: string;
  newAnyo: number;
  newDuracionH: number;
  newDuracionM: number;
  newOverview: string;

  //variables formulario agregacion actor/personaje
  agregarActor: boolean = false;
  newNombre: string;
  newClip: any;
  newEdad: string;
  newImagenActor: string;
  newNacionalidad: string;
  newVivo: string;
  newNombrePersonaje: string;
  newDescripcion: string;
  peliculaActor: string;
  clipUrl: string;

  broadcast :BroadcastChannel;

  constructor(private messaging: MessagingService, private peliculasService: PeliculasService, private actoresService: ActoresService, private personajesService: PersonajesService, private storage: Storage, private sanitizer: DomSanitizer, private storageService: StorageService) {
    
  }


  ngOnInit(): void {
    //this.getPeliculas();
    this.peliculasService.getAll().subscribe(
      peliculas => {
        this.peliculas = peliculas;
      }
    )
    this.actoresService.getAll().subscribe(
      actores =>{
        this.actores= actores;
      }
    )
    this.imagesRefs = this.storageService.getAllImages();
    this.clipsRefs = this.storageService.getAllClips();
    //this.messaging.receiveMessaging()
    //this.messaging.callOnMessage();
  }


  edit(): void {
    this.editar = !this.editar;
    this.previsualizacion = "";
  }

  changeAgregar(): void {
    this.agregar = !this.agregar;
    this.previsualizacion = "";
    this.newTitulo = "";
    this.newAnyo = {} as number;
    this.newAnyo = {} as number;
    this.newDuracionH = {} as number;
    this.newDuracionM = {} as number;
    this.newOverview = "";
    this.messaging.receiveMessaging();

  }

  changeAgregarActor(titulo: string): void {
    this.agregarActor = !this.agregarActor;
    this.previsualizacion = "";
    this.peliculaActor = titulo;
    console.log(this.peliculaActor == titulo);
    console.log(titulo);
    this.newNombre = "";
    this.newClip = "";
    this.newEdad = "";
    this.newImagenActor = "";
    this.newNacionalidad = "";
    this.newVivo = "";
    this.newNombrePersonaje = "";
    this.newDescripcion = "";
    this.peliculaActor = "";
  }

  editPelicula(pelicula: Pelicula): void {
    this.edit();
    this.overviewForm = pelicula.argumento;
    this.tituloForm = pelicula.titulo;
    this.anyoForm = pelicula.anyo;
    this.duracionHForm = pelicula.duracionHoras;
    this.duracionMForm = pelicula.duracionMinutos;
  }

  savePelicula(pelicula: Pelicula): void {
    if (pelicula.titulo != this.tituloForm) {
      pelicula.titulo = this.tituloForm;
    }
    if (pelicula.duracionHoras != this.duracionHForm) {
      pelicula.duracionHoras = this.duracionHForm;
    }
    if (pelicula.duracionMinutos != this.duracionMForm) {
      pelicula.duracionMinutos = this.duracionMForm;
    }
    if (pelicula.anyo != this.anyoForm) {
      pelicula.anyo = this.anyoForm;
    }
    if (pelicula.argumento != this.overviewForm) {
      pelicula.argumento = this.overviewForm;
    }

    if (this.previsualizacion != "") {
      this.upload(this.imageForm, pelicula);
    }
    else {
      this.peliculasService.update(pelicula);
      this.edit();
    }
  }

  addPelicula(pelicula: Pelicula): void {

    if (this.previsualizacion != "") {
      this.upload(this.imageForm, pelicula);
    }
    else {
      this.peliculasService.add(pelicula);
      this.edit();
    }
  }

  async addActor(value: any, pelicula: Pelicula) {

    //Primero crea el actor, y con la id generada del actor, se crea el personaje
    let actorToFirestone = {
      nombre: value.newNombre,
      vivo: value.newVivo === "true" && true,
      imagen: value.newImagenActor,
      clip: this.newClip.name,
      edad: value.newEdad,
      nacionalidad: value.newNacionalidad,
    };

    const res = await this.actoresService.add(actorToFirestone);
    const actorFromFirestore = await this.actoresService.findOneById(res.id).then((obj: any) => new Actor(res.id, obj.nombre, obj.edad, obj.clip, obj.nacionalidad, obj.vivo, this.imageForm))
    const actorRef = this.actoresService.getOneById(actorFromFirestore)
    const peliculaRef = this.peliculasService.getOneById(pelicula)

    this.uploadClip(this.newClip, this.imageForm, actorFromFirestore);
    //this.uploadImageActor(this.imageForm, actorFromFirestore);
    
  }

  //previsualizacion de la imagen
  previewFile($event: any) {
    this.$event = $event;
    this.imageForm = this.$event.target.files[0];
    this.extractBase64(this.imageForm)
      .then(
        (imagen: any) => {
          this.previsualizacion = imagen.base;
        }
      )
      .catch(error => console.log(error))
  }

  //sube la imagen al storage
  async upload(image: any, pelicula: Pelicula) {
    const reference = ref(this.storage, `assets/images/films/${image.name}`);  //referencia a la imagen  o video
    uploadBytes(reference, image)
      .then(
        response => {
          for (let image of this.imagesRefs) {
            if (image.name == this.imageForm.name) {
              getDownloadURL(image)
                .then(
                  (response) => {
                    pelicula.image = response
                    if (!this.agregar) {
                      this.peliculasService.update(pelicula);
                      this.edit();
                    }
                    else {
                      this.peliculasService.add(pelicula);
                      this.changeAgregar();
                    }
                  }
                )
                .catch((error) => console.log(error))

            }
          }
        }
      )
      .catch(error => console.log(error))
  }


  //sube la imagen al storage
  async uploadImageActor(image: any, actor: Actor) {
    console.log("IMAGE: ", image);
    const reference = ref(this.storage, `assets/images/actores/${image.name}`);
    const uploadTask= uploadBytesResumable(reference, image);
    uploadTask.on( 'state_changed',
      (snapshot) =>{
        console.log("IMAGEN SUBIDA: ", snapshot)
      },
      (error) =>{
        console.log("ERROR AL SUBIR IMAGEN: ", error)
      },
      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>{
          console.log("URL DE IMAGEN: ", url);
          actor.imagen = url;
          this.actoresService.update(actor);
          this.changeAgregarActor("");
        })
      }

    )
  }

  prepareClip($event: any) {
    this.$eventClip = $event;
    this.newClip = this.$eventClip.target.files[0];
    this.extractBase64(this.newClip)
      .then(
        response => console.log(response)
      )
      .catch(
        error => console.log(error)
      )
  }

  async uploadClip(clip: any, image: any, actor: Actor) {
    const reference = ref(this.storage, `media/${clip.name}`);  //referencia a la imagen  o video
    uploadBytes(reference, clip)
      .then(
        response => {
          for (let item of this.clipsRefs) {
            if (item.name == this.newClip.name) {
              getDownloadURL(item)
                .then(
                  (response) => {
                    this.clipUrl = response;
                    actor.clip = response;
                    //this.actoresService.update(actor);
                    this.uploadImageActor(image, actor);
                  }
                )
                .catch((error) => console.log(error))

            }
          }
        }
      )
      .catch(error => console.log(error))
  }
  //pasa la imagen a base 64 para la previsualizacion
  extractBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unImg = window.URL.createObjectURL($event);
      const img = this.sanitizer.bypassSecurityTrustUrl(unImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    } catch (e) {
      null;
    }
  })

  agregarPelicula() {
    //this.previsualizacion= "";
    let newPelicula = new Pelicula(this.newTitulo, this.newDuracionM, this.newDuracionH, this.newAnyo, "", this.newOverview);
    this.addPelicula(newPelicula);
  }

  deletePelicula(pelicula: Pelicula) {
    let personajes: Personaje[];
    this.personajesService.getAll().subscribe(
      personajs => {
        personajes = personajs;
        for (let personaje of personajes) {
          if (personaje.pelicula.id == pelicula.id) {
            alert("Elimine primero los personajes de la pelicula.")
            return;
          }
          else {
            this.peliculasService.delete(pelicula);
          }
        }
      }
    )

  }
}
