import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { ViewofertaPage } from '../viewoferta/viewoferta';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { GpsProvider } from '../../providers/gps/gps';

@IonicPage()
@Component({
    selector: 'page-produtos-info',
    templateUrl: 'produtos-info.html',
})
export class ProdutosInfoPage {

    private Key;
    ListaProdutos: any;
    filtrarProdutos: boolean;
    filtrarPorRaioDeInteresse: boolean = false;
    dicionarioInteresseUsuarios: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private provider: OfertaProvider,
                public provUser: UserMaintenance,
                public provProduto: ProdutosProvider,
                private GPS: GpsProvider,
                private modal: ModalController){
    }

    ionViewDidEnter() {
        this.ListaProdutos = this.provProduto.getAllContagem();
    }

    alternarFiltro(){
        if(this.filtrarProdutos)
          this.filtrarProdutos = false;
        else
          this.filtrarProdutos = true;
    }

    async atualizarFiltroPorRaioDeInteresse(){
      this.filtrarPorRaioDeInteresse = !this.filtrarPorRaioDeInteresse;
      if(!this.filtrarPorRaioDeInteresse){
        this.ListaProdutos = this.provProduto.getAllContagem();
        return;
      }
       this.provProduto.updateContagemConsiderandoRaio();
       this.ListaProdutos = this.provProduto.getAllContagemConsiderandoRaio();
    }

    abrirRemoverInteresses(){
      const meus_produtos = this.modal.create("ModalRemoverInteressePage", {user: 'estab'});
      meus_produtos.present();
    }

    abrirModalProdutos(){
      const meus_produtos = this.modal.create("ModalProdutosPage",{continuar: 1, user: 'estab'});
      meus_produtos.present();
    }

}
