import { Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController)
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

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
  
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  
  }

  dismissModal(data?: any ) {
    return this.modalCtrl.dismiss(data);
  }

}
