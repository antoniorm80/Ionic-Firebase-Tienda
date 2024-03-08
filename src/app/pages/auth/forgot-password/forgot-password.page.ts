import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])    
  });

  firebaseSvc = inject(FirebaseService)
  loaderSvc= inject(LoaderService)

  ngOnInit() {
  }

  async onSubmit() {
    if(this.form.valid) {
      
      const loading = await this.loaderSvc.loading();
      await loading.present();

      this.firebaseSvc.sendRecoveyEmail(this.form.value.email)
      .then(response => {         

        this.loaderSvc.presentToast({
          header: "AVISO",
          message: "Correo electrónio enviado con éxito.",
          duration: 1500,
          color: "warning",
          position: "middle",
          icon: "mail-outline"
         })

         this.loaderSvc.routerLink('/auth');
         this.form.reset();
        })
      .catch(error => {
         console.log(error.message);
         this.loaderSvc.presentToast({
          header: "ERROR",
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

