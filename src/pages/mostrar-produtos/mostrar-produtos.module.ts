import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostrarProdutosPage } from './mostrar-produtos';

@NgModule({
  declarations: [
    MostrarProdutosPage,
  ],
  imports: [
    IonicPageModule.forChild(MostrarProdutosPage),
  ],
})
export class MostrarProdutosPageModule {}
