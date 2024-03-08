import { Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  //  *********** loading  ***********
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //  *********** Toast ***********
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //  *********** Navegar ***********
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //  *********** Guardar - Localstorage ***********
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //  *********** Obtener - Localstorage ***********
   getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}
