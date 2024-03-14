import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title:  'Inicio', url: '/main/home', icon: 'home-outline' },
    { title:  'Perfil', url: '/main/profile', icon: 'person-outline' }
  ]

  firebaseSrv = inject(FirebaseService);
  loaderSrv = inject(LoaderService);
  router = inject(Router);
  currentPath: string = "";
  
  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event?.url)  this.currentPath = event.url;
    })
  }

  user(): User {
    return  this.loaderSrv.getFromLocalStorage('user');
   }

  singOut() {
    this.firebaseSrv.signOut();
  }

}
