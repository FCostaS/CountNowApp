import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiveReviewPage } from './give-review';

@NgModule({
    declarations: [
        GiveReviewPage,
    ],
    imports: [
        IonicPageModule.forChild(GiveReviewPage),
    ],
})
export class GiveReviewPageModule { }
