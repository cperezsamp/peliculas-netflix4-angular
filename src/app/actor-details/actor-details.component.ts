import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActoresService } from '../actores.service';
import { Actor } from '../models/actor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../storage.service';
import { Storage, listAll, ref, uploadBytes, getDownloadURL, StorageReference } from '@angular/fire/storage';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css'],
})
export class ActorDetailsComponent implements OnInit {
  @Input() actorId: string;
  actor: Actor;
  editForm: FormGroup;
  isEditMode: boolean = false;
  nombreForm: string;
  edadForm: number;
  nacionalidadForm: string;
  imagenForm: string;
  clipForm: any;
  vivoForm: boolean;
  $eventClip: any;
  clipsRefs: StorageReference[];
  clipUrl: string;

  constructor(
    private actoresService: ActoresService, private storage: Storage, private sanitizer: DomSanitizer, private storageService: StorageService
  ) {
    /*this.editForm = this.formBuilder.group({
    nombre: [''],
    edad: [''],
    nacionalidad: [''],
    imagen: [''],
    clip: [''],
    vivo: [false],
  });*/
  }

  ngOnInit(): void {
    this.actoresService.findOneById(this.actorId).then((obj: any) => {
      this.actor =
        new Actor(this.actorId, obj.nombre, obj.edad, obj.clip, obj.nacionalidad, obj.vivo, obj.imagen)
      this.nombreForm = obj.nombre;
      this.edadForm = obj.edad;
      this.nacionalidadForm = obj.nacionalidad;
      this.imagenForm = obj.imagen;
      this.clipForm = obj.clip;
      this.vivoForm = obj.vivo;
    });
    this.clipsRefs = this.storageService.getAllClips();
  }



  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }


  async saveActorDetails() {

    const actorFromFirestone = await this.actoresService.findOneById(this.actorId).then((obj: any) => new Actor(this.actorId, obj.nombre, obj.edad, obj.clip, obj.nacionalidad, obj.vivo, this.imagenForm))

    if (this.actor.nombre != this.nombreForm) {
      this.actor.nombre = this.nombreForm;
    }
    if (this.actor.edad != this.edadForm) {
      this.actor.edad = this.edadForm;
    }
    if (this.actor.nacionalidad != this.nacionalidadForm) {
      this.actor.nacionalidad = this.nacionalidadForm;
    }
    if (this.actor.imagen != this.imagenForm) {
      this.actor.imagen = this.imagenForm;
    }
    if (this.actor.vivo != this.vivoForm) {
      this.actor.vivo = this.vivoForm;
    }
    this.actoresService.update(this.actor);
    this.uploadClip(this.clipForm, actorFromFirestone);
    this.toggleEditMode()
  }


  prepareClip($event: any) {
    this.$eventClip = $event;
    this.clipForm = this.$eventClip.target.files[0];
  }

  async uploadClip(clip: any, actor: Actor) {
    const reference = ref(this.storage, `media/${clip.name}`);  //referencia a la imagen  o video
    uploadBytes(reference, clip)
      .then(
        response => {
          for (let item of this.clipsRefs) {
            if (item.name == this.clipForm.name) {
              getDownloadURL(item)
                .then(
                  (response) => {
                    this.clipUrl = response;
                    actor.clip = response;
                    this.actoresService.update(actor);
                  }
                )
                .catch((error) => console.log(error))
            }
          }
        }
      )
      .catch(error => console.log(error))
  }
}
