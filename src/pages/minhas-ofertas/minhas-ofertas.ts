import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InserirOfertaPage } from '../inserir-oferta/inserir-oferta';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { Observable } from 'rxjs';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ViewofertaPage } from '../viewoferta/viewoferta';
import { ViewofertaEstabelecimentoPage } from '../viewoferta-estabelecimento/viewoferta-estabelecimento';
/**
 * Generated class for the MinhasOfertasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-minhas-ofertas',
    templateUrl: 'minhas-ofertas.html',
})
export class MinhasOfertasPage {
    listaOferta: Observable<any>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public provOferta: OfertaProvider,
                public provUser: UserMaintenance
                ) {
                this.listaOferta = this.provOferta.getAllEstab(this.provUser.getUserKey());

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MinhasOfertasPage');
    }

    IOferta() {
        this.navCtrl.push(InserirOfertaPage);
    }

    ViewDetails(Oferta) {
        this.provOferta.OfertaAtual = Oferta;
        this.navCtrl.push(ViewofertaPage);
    }
    ViewDetailsEstab(Oferta) {
        this.provOferta.OfertaAtual = Oferta;
        this.navCtrl.push(ViewofertaEstabelecimentoPage);
    }

}
