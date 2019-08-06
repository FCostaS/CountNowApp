import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerRequestsPage } from './ver-requests';

@NgModule({
  declarations: [
    VerRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(VerRequestsPage),
  ],
})
export class VerRequestsPageModule {}
