import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, Inject } from '@angular/core';
import { ActoresService } from '../actores.service';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})



export class PlayerComponent implements OnInit {

  @Input() actorId: string;
  video: string;
  isVideoLoaded: boolean;
  @ViewChild('divVideo', { static: false }) divVideo: ElementRef;

  

  constructor(private actoresService: ActoresService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
    this.isVideoLoaded = false;
  }

  ngOnInit() {
    this.actoresService.findOneById(this.actorId).then((obj: any) => {
      if (obj.clip.includes("firebasestorage")) {
        this.video = obj.clip;
      } else {
        this.video = `../assets/media/${obj.clip}`;
      }
      this.isVideoLoaded = true;    
    })
    
  }

  ngAfterViewInit(){
    this.addControls();
  }

  addControls(){
    console.log("IN ADD CONTROLS");
    let script = this.renderer.createElement('script');
    script.type= 'application/ld+json';
    script.text = `
      function playPause() { 
        var video = document.getElementById("player");
        if (video.paused) 
            video.play(); 
        else 
            video.pause(); 
      }
      function reload() { 
          var video = document.getElementById("player");
          video.load(); 
      }
      function makeLarge() { 
          var video = document.getElementById("player");
          video.width = 1000; 
      }
      function makeSmall() { 
          var video = document.getElementById("player");
          video.width = 250; 
      } 
      function makeNormal() { 
          var video = document.getElementById("player");
          video.width = 500; 
      } 
    `;
    this.renderer.appendChild(this.document.body, script);
  }


    
  

}
