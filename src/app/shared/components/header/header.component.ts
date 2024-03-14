import { Component, Input, OnInit, inject } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal: boolean;
  @Input() showMenu: boolean;

  loadingSrv = inject(LoaderService);

  
  ngOnInit() {}

  dismissModal() {
    this.loadingSrv.dismissModal();
  }

}
