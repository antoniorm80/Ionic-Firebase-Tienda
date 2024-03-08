import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(FirebaseService)
  loaderSvc= inject(LoaderService)

  ngOnInit() {
  }

  async onSubmit() {
    if(this.form.valid) {
      
      const loading = await this.loaderSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User)
      .then(response => {         
         this.getUserInfo(response.user.uid);
        })
      .catch(error => {
         console.log(error.message);
         this.loaderSvc.presentToast({
          header: "EROR",
          message: "El correo electrónio y/o la contraseña son incorrectos.",
          duration: 2500,
          color: "danger",
          position: "middle",
          icon: "alert-circle-outline"
         })
      })
      .finally(() => {
        loading.dismiss();
      })
    }
    
  }

  async getUserInfo(uid: string) {
    if(this.form.valid) {
      
      const loading = await this.loaderSvc.loading();
      await loading.present();

      let path = `users/${uid}`;      

      this.firebaseSvc.getDocument(path)
      .then( (user: User)  => {        
         this.loaderSvc.saveInLocalStorage('user', user);   
         this.loaderSvc.routerLink('/main/home');
         this.form.reset();

         this.loaderSvc.presentToast({
          header: "¡BIENVENIDO!" ,
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: "success",
          position: "middle",
          icon: "person-circle-outline"
         })
         
        })
      .catch(error => {
         console.log(error.message);
         this.loaderSvc.presentToast({
          header: "EROR",
          message: "El correo electrónio y/o la contraseña son incorrectos.",
          duration: 2500,
          color: "danger",
          position: "middle",
          icon: "alert-circle-outline"
         })
      })
      .finally(() => {
        loading.dismiss();
      })
    }    
  }


}
