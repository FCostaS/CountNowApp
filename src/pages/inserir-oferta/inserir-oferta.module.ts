import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InserirOfertaPage } from './inserir-oferta';

@NgModule({
    declarations: [
        InserirOfertaPage,
    ],
    imports: [
        IonicPageModule.forChild(InserirOfertaPage),
    ],
})
export class InserirOfertaPageModule { }
