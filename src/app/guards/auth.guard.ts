import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { LoaderService } from '../services/loader.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSrv = inject(FirebaseService);
  loaderSrv = inject(LoaderService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = localStorage.getItem('user');

    return new Promise((resolve, reject) => {      
      this.firebaseSrv.getAuth().onAuthStateChanged( ( auth ) => {
        if (auth) {
          if (user) resolve(true);
        } else {
          this.firebaseSrv.signOut();
          resolve(false);
        }
      })
    });
  }
  
}
