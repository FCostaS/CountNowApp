import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { GiveReviewPage } from '../give-review/give-review';
import { ReviewProvider } from '../../providers/reviews/reviews';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { GpsProvider } from '../../providers/gps/gps';
import { MapaPage } from '../mapa/mapa';
declare var google;

@IonicPage()
@Component({
    selector: 'page-detalhes-estab',
    templateUrl: 'detalhes-estab.html',
})
export class DetalhesEstabPage {
    mediaTemp: number
    destinationPosition = null;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public provEstab: EstabProvider,
        public provReview: ReviewProvider,
        public provUser: UserMaintenance,
        private modal: ModalController,
        private Mapa: GpsProvider) {
        this.mediaTemp=0;
        this.destinationPosition = new google.maps.LatLng(this.provEstab.EstabAtual.latitude, this.provEstab.EstabAtual.longitude);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetalhesEstabPage');
    }

    avaliarEstab() {
        const subscribe = this.provReview.get(
            'Reviews/' + this.provEstab.EstabAtual.key + '/'
            + this.provUser.getUserKey() + '/')
            .subscribe((c: any) => {
                subscribe.unsubscribe();
                this.provReview.ReviewAtual = c;
                this.navCtrl.push(GiveReviewPage);
            });
    }

    abrirModalReview(){
      const reviews = this.modal.create("ModalReviewPage")
      reviews.present()
    }
    abrirModalOfertas(){
      const reviews = this.modal.create("ModalOfertasPage")
      reviews.present()
    }

    adicionarNota(notaNova: number){
      //this.provUser.incNumAval(this.provEstab.EstabAtual.key);
      this.provUser.incrementarMedia(this.provEstab.EstabAtual.key,notaNova);
    }

    testeExiste(){
      var x = this.provReview.existeReview(this.provEstab.EstabAtual.key,this.provUser.getUserKey());
      console.log(x);
    }

    async calcMedia(estabKey: string){
      var x = this.provReview.calcMedia(this.provEstab.EstabAtual.key);
      var media;
      x.then(snapshot =>{
        var numReviews = (snapshot.numChildren());
        var total = 0;
        snapshot.forEach(function(reviewSnapshot){
          total += Number(reviewSnapshot.val().Nota);
        })
        this.mediaTemp = total/numReviews;
      })
    }

    VerRota(){
      if(!this.Mapa.initMap)
      {
          this.Mapa.destinationPosition = this.destinationPosition;
      }
      this.navCtrl.push(MapaPage);
      this.Mapa.calculateRoute(this.Mapa.originPosition,this.destinationPosition);
    }
}
