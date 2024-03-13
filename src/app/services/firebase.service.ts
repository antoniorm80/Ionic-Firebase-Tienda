import { Injectable, inject } from '@angular/core';
// firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData, 
  query,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import User from '../models/user.model';
import { LoaderService } from './loader.service';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  loaderService = inject(LoaderService);

  // ************************ Autenticaicón ************************
  // Current Log.
  getAuth() {
    return getAuth();
  }

  // Ingresar
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  // Registrar
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Reestablecer
  sendRecoveyEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.loaderService.routerLink('/auth');
  }

  // ************************ Base de Datos ************************
  // Obtener documentos de una colección. 
  getCollectionData(path: string, collectionQuey?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuey), {idField: 'id'});
  }

  // Setear un documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Actualizar un documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // Eliminar un documento
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // Obtener un documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // ****************** Almacenamiento *********************

  // Subir Imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  // Obtener ruta de la imagen y su url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // Eliminar archivo del Storage
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }



}
