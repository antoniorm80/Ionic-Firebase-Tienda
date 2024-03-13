import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  loaderSvc= inject(LoaderService);


  ngOnInit() {
  }

  async onSubmit() {
    if(this.form.valid) {
      
      const loading = await this.loaderSvc.loading();
      await loading.present();

      this.firebaseSvc.singUp(this.form.value as User)
      .then( async response => {        
         await this.firebaseSvc.updateUser(this.form.value.name);
         
         let uid = response.user.uid;
         this.form.controls.uid.setValue(uid);

         this.setUserInfo(uid);
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

  async setUserInfo(uid: string) {
    if(this.form.valid) {
      
      const loading = await this.loaderSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value)
      .then( async response => {        
         await this.loaderSvc.saveInLocalStorage('user', this.form.value);   
         this.loaderSvc.routerLink('/main/home');
         this.form.reset();
         
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
