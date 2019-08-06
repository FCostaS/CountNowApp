import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutosInfoPage } from './produtos-info';

@NgModule({
    declarations: [
        ProdutosInfoPage,
    ],
    imports: [
        IonicPageModule.forChild(ProdutosInfoPage),
    ],
})
export class ProdutosInfoPageModule { }
