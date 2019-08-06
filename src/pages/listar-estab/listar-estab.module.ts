import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListarEstabPage } from './listar-estab';

@NgModule({
    declarations: [
        ListarEstabPage,
    ],
    imports: [
        IonicPageModule.forChild(ListarEstabPage),
    ],
})
export class ListarEstabPageModule { }
