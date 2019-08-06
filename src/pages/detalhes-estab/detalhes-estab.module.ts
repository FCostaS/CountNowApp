import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhesEstabPage } from './detalhes-estab';

@NgModule({
    declarations: [
        DetalhesEstabPage,
    ],
    imports: [
        IonicPageModule.forChild(DetalhesEstabPage),
    ],
})
export class DetalhesEstabPageModule { }
