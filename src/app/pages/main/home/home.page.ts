import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSrv = inject(FirebaseService);
  loadingCtrl = inject(LoaderService);

   ngOnInit() {
  }

  signOut() {
    this.firebaseSrv.signOut();
  }
}
