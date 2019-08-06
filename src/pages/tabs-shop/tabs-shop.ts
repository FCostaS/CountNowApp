import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProdutosInfoPage } from '../produtos-info/produtos-info';
import { MinhasOfertasPage } from '../minhas-ofertas/minhas-ofertas';
import { UserPage } from '../user/user';

/**
 * Generated class for the TabsShopPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-tabs-shop',
    templateUrl: 'tabs-shop.html'
})
export class TabsShopPage {

    produtosInfoRoot = ProdutosInfoPage;
    minhasOfertasRoot = MinhasOfertasPage;
    contaRoot = UserPage;


    constructor(public navCtrl: NavController) { }

}
