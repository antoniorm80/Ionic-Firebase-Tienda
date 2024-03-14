import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSrv = inject(FirebaseService);
  loaderSrv = inject(LoaderService);

  constructor() { }

  ngOnInit() {
  }
  
  user(): User {
    return  this.loaderSrv.getFromLocalStorage('user');
   }

   async takeImage() {

    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.loaderSrv.takePicture('Imagen de Perfil')).dataUrl;
    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSrv.uploadImage(imagePath, dataUrl);

    const loading = await this.loaderSrv.loading();
    await loading.present();

         this.firebaseSrv
        .updateDocument(path, { image: user.image })
        .then(async (response) => {
      
          this.loaderSrv.saveInLocalStorage('user', user);
  
          this.loaderSrv.presentToast({
            header: 'ÉXITO',
            message: 'Imagen actualizado exitosamente.',
            duration: 1500,
            color: 'warning',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error.message);
          this.loaderSrv.presentToast({
            header: 'ERROR',
            message: 'El correo electrónio y/o la contraseña son incorrectos.',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
   
  }

}
