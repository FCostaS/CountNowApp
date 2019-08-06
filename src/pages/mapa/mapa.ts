import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { GpsProvider } from '../../providers/gps/gps';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  //directionsService = new google.maps.DirectionsService();
  //directionsDisplay = new google.maps.DirectionsRenderer();
  //destinationPosition: any;
  distanciaMaxima: number;

  constructor(
      public navCtrl: NavController,
      private Mapa: GpsProvider,
      private estabProvider: EstabProvider,
      public modal: ModalController,
      ){
        //this.Mapa.StartMap(this.Mapa.Localizacao.latitude,this.Mapa.Localizacao.longitude);
        //this.destinationPosition = new google.maps.LatLng(-23.18425, -45.88677);
      }

  ionViewDidLoad() {
    this.Mapa.StartMap();
  }

  setDistanciaMaxima(tagId){
    var distancia;
    if(tagId == null)
      distancia = 100;
    else
      distancia = (<HTMLInputElement>document.getElementById(tagId)).value;

    if(distancia > 0)
      this.distanciaMaxima  = distancia;
    else
      this.distanciaMaxima = 100;

    this.filtrarEstabelecimentosPorDistancia();
    this.Mapa.atualizarMapa();
  }

  async filtrarEstabelecimentosPorDistancia() {
    var objeto = this;
    var distancia = 0;
    await objeto.estabProvider.getRef("").orderByChild("key").once("value").then(function(estabelecimentos){
      estabelecimentos.forEach(function(estabelecimento) {
        var latitude = estabelecimento.val().latitude;
        var longitude = estabelecimento.val().longitude;
        distancia = objeto.Mapa.getDistancia(latitude, longitude);
        if(distancia <= objeto.distanciaMaxima){
          objeto.Mapa.setEstabelecimentosAMostrar(estabelecimento.key, estabelecimento.val().nome, latitude, longitude);
        }
      });
    });
    return;
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
