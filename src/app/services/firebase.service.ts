import { Injectable, importProvidersFrom, inject } from '@angular/core';
// firebase
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { getFirestore, setDoc, doc, getDoc } from "@angular/fire/firestore";
import User from '../models/user.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  loaderService = inject(LoaderService);

  // ************************ Autenticaicón ************************
  // Current Log. 
    getAuth() {
      return getAuth();
    }

    // Ingresar
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  // Registrar
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // Reestablecer
  sendRecoveyEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.loaderService.routerLink('/auth');
  }

  // ************************ Base de Datos ************************
  // Setear un documento
  setDocumnet(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Obtener un documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

}
