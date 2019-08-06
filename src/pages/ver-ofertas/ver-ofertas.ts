import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { Observable } from 'rxjs/Observable';
import { ViewofertaPage } from '../viewoferta/viewoferta';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { GpsProvider } from '../../providers/gps/gps';
import 'rxjs/add/operator/map';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { MapaPage } from '../mapa/mapa';
/**
 * Generated class for the VerOfertasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-ver-ofertas',
    templateUrl: 'ver-ofertas.html',
})
export class VerOfertasPage {
    ListaOfertas: any;

    grupo: string;
    data: any;
    distanciaMaxima: number;
    FiltroData: boolean;
    Today = { year: 0, month: 0, day: 0 };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private provider: OfertaProvider,
        public provUser: UserMaintenance,
        public provProdutos: ProdutosProvider,
        private GPS: GpsProvider,
        public modal: ModalController,
        private estabProvider: EstabProvider,
    ) {

        this.distanciaMaxima = 100;
    }

    ionViewDidEnter() {
        this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
            .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
        console.log('ionViewDidEnter VerOfertasPage');
    }

    atualizarListaOferta(ListaOfertas) {
        this.ListaOfertas = ListaOfertas;
    }

    filtrarInteresses() {

        if (this.provider.filtrarInt === true) {
            this.provider.filtrarInt = false;
        }
        else {
            this.provider.filtrarInt = true;
        }
        this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
            .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    ViewDetails(Oferta) {
        this.provider.OfertaAtual = Oferta;
        this.navCtrl.push(ViewofertaPage);
    }

    filtrarPorDistancia(){
      document.getElementById("campo_distancia").hidden = !document.getElementById("campo_distancia").hidden;
      this.provider.filtrarDistancia = !document.getElementById("campo_distancia").hidden;

      this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
          .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    setDistanciaMaxima() {
        if (this.distanciaMaxima == null) {
            this.provider.filtrarDistancia = false;
        }
        else {
            this.provider.filtrarDistancia = true;
        }
        this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
            .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    filtrarPorData() {
      this.provider.filtrarData = !this.provider.filtrarData;
      document.getElementById("campo_data").hidden = !document.getElementById("campo_data").hidden;
      this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
          .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    setData(data) {
        this.data = Object.keys(data).map(key => data[key]);
        this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
            .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    filtrarPorGrupo(grupo) {
        this.grupo = grupo;
        if (this.grupo == "Nenhum") {
            this.provider.filtrarGrupo = false;
        }
        else {
            this.provider.filtrarGrupo = true;
        }
        this.provider.getAllFiltro(this.provUser.getUserKey(), this.data, this.grupo, this.distanciaMaxima)
            .subscribe(ListaOfertas => this.atualizarListaOferta(ListaOfertas));
    }

    abrirRemoverInteresses(){
      const meus_produtos = this.modal.create("ModalRemoverInteressePage",{user: 'cliente'});
      meus_produtos.present();
    }

    abrirModalProdutos(){
      const meus_produtos = this.modal.create("ModalProdutosPage",{continuar: 1, user: 'cliente'});
      meus_produtos.present();
    }


}
