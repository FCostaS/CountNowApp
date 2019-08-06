import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOfertasPage } from './modal-ofertas';

@NgModule({
  declarations: [
    ModalOfertasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOfertasPage),
  ],
})
export class ModalOfertasPageModule {}
