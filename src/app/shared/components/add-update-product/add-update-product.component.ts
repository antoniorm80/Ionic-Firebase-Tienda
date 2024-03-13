import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  loaderSvc = inject(LoaderService);

  user = {} as User;

  ngOnInit() {
    this.user = this.loaderSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  async takeImage() {
    const dataUrl = (await this.loaderSvc.takePicture('Imagen del producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if (soldUnits.value ) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value ) price.setValue(parseFloat(price.value));
  }

  // Crear Producto
  async createProduct() {
    let path = `users/${this.user.uid}/products`;

    const loading = await this.loaderSvc.loading();
    await loading.present();

    // Subir imagen y obtener la Url
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc
      .addDocument(path, this.form.value)
      .then(async (response) => {
        await this.firebaseSvc.updateUser(this.form.value.name);

        this.loaderSvc.dismissModal({ success: true });

        this.loaderSvc.presentToast({
          header: 'ÉXITO',
          message: 'Producto creado exitosamente.',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error.message);
        this.loaderSvc.presentToast({
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

  // Actualizar producto
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.loaderSvc.loading();
    await loading.present();

    // Si cambió la imagen, subir la nueva imagen y obtener la Url
    if ( this.form.value.image !== this.product.image){
       let dataUrl = this.form.value.image;
       let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
       let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
       this.form.controls.image.setValue(imageUrl);
    }
   
    delete this.form.value.id;

    this.firebaseSvc
      .updateDocument(path, this.form.value)
      .then(async (response) => {
        await this.firebaseSvc.updateUser(this.form.value.name);

        this.loaderSvc.dismissModal({ success: true });

        this.loaderSvc.presentToast({
          header: 'ÉXITO',
          message: 'Producto actualizado exitosamente.',
          duration: 1500,
          color: 'warning',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error.message);
        this.loaderSvc.presentToast({
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
