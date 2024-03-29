import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import User from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  firebaseSrv = inject(FirebaseService);
  loaderSrv = inject(LoaderService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  user(): User {
   return  this.loaderSrv.getFromLocalStorage('user');
  }

  // función "ionViewWillEnter", que se ejecuta cada vez que el usuario entra a la página.   
  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // Obtener las ganacias 
  getProfits() {
    return this.products.reduce( (index, product) =>
      index + product.price * product.soldUnits, 0);
  }

  // Obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    this.loading = true;

    let  query = [
      orderBy('soldUnits', 'desc')
      // ,where('soldUnits', '>=', 12)
    ]

    let sub = this.firebaseSrv.getCollectionData(path, query).subscribe({
      next: (resp: any) => {        
        this.products = resp;
        this.loading = false;
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

  // Confrmar la eleminación del producto
  async confirmDeleteProduct(product: Product) {
    this.loaderSrv.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },{
          text: 'Sí, eliminar',          
          handler: () => {
            this.deleteProduct(product)
          }
        }
      ]
    });    
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
