import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsShopPage } from './tabs-shop';

@NgModule({
    declarations: [
        TabsShopPage,
    ],
    imports: [
        IonicPageModule.forChild(TabsShopPage),
    ]
})
export class TabsShopPageModule { }
