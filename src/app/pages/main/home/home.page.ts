import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  firebaseSrv = inject(FirebaseService);
  loaderSrv = inject(LoaderService);

  products: Product[] = [];
  ngOnInit() {
  }

  user(): User {
   return  this.loaderSrv.getFromLocalStorage('user');
  }

  // función "ionViewWillEnter", que se ejecuta cada vez que el usuario entra a la página.   
  ionViewWillEnter() {
    this.getProducts();
  }

  // Obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSrv.getCollectionData(path).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.products = resp;
        sub.unsubscribe();
      }
    })
  }

  // Agregar o actualizar producto
 async addUpdateProduct(product?: Product) {
    let success = await this.loaderSrv.presentModal( {
      component: AddUpdateProductComponent
      ,cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if(success) this.getProducts();
    
  }

  // Eliminar Producto
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.loaderSrv.loading();
    await loading.present();

    // Eliminamos la imagen del producto (Storage).
    let imagePath = await this.firebaseSrv.getFilePath(product.image);       
    await this.firebaseSrv.deleteFile(imagePath);

    // Eliminamos el documento de la Base de datos. 
    this.firebaseSrv.deleteDocument(path)
      .then(async res => {     
        
        // Devolver la lista de los productos pero, sin el que fué eliminado.
        this.products = this.products.filter(p => p.id !== product.id);

        this.loaderSrv.presentToast({
          header: 'AVISO',
          message: 'Producto eliminado exitosamente.',
          duration: 1500,
          color: 'danger',
          position: 'middle',
          icon: 'trash-outline',
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
