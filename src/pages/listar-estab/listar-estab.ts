import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { Observable } from 'rxjs';
import { DetalhesEstabPage } from '../detalhes-estab/detalhes-estab';
import { ReviewProvider } from '../../providers/reviews/reviews';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { GiveReviewPage } from '../give-review/give-review';
declare var google;
import { GpsProvider } from '../../providers/gps/gps';
import { MapaPage } from '../mapa/mapa';
import { ImagensEstabPage } from '../imagens-estab/imagens-estab';




@IonicPage()
@Component({
    selector: 'page-listar-estab',
    templateUrl: 'listar-estab.html',
})
export class ListarEstabPage {
    mediaTemp: number;
    destinationPosition = null;
    ListaEstab: Observable<any>;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private provEstab: EstabProvider,
        public provReview: ReviewProvider,
        private Prod: ProdutosProvider,
        public provUser: UserMaintenance,
        public notify: NotificationsProvider,
        private modal: ModalController,
        private Mapa: GpsProvider,
        public actionSheetCtrl: ActionSheetController,
        ) {
        this.ListaEstab = this.provEstab.getAll();
        this.mediaTemp=0;

    }

    ionViewDidLoad() {
        /** this.VerifyNotification();  */
        //console.log('ionViewDidLoad ListarEstabPage');
    }

    VerDetalhes(Estab) {
        this.provEstab.EstabAtual = Estab;
        this.navCtrl.push(DetalhesEstabPage);
    }

    async teste(estabKey: string){
      var x = this.provReview.calcMedia(estabKey);
      var media;
      x.then(snapshot =>{
        var numReviews = (snapshot.numChildren());
        var total = 0;
        snapshot.forEach(function(reviewSnapshot){
          total += Number(reviewSnapshot.val().Nota);
        })
        media = total/numReviews;
        return media;
      })
    }

    VerifyNotification(){
        if(this.notify.ReceberNotificacoes)
        {
            this.Prod.ProdutoNotifications(this.provUser.UserKey);
            //console.log(this.Prod.ListaInteresse);
        }
    }

    actionSheetEstabs(Estab){
      const actionSheet = this.actionSheetCtrl.create({
        title: 'O que deseja fazer?',
        buttons: [
          {
            text: 'Avaliar',
            icon: 'star',
            handler: () => {
              this.provEstab.EstabAtual = Estab;
              this.avaliarEstab();
            }
          },{
            text: 'Comentários',
            icon: 'chatbubbles',
            handler: () => {
              this.provEstab.EstabAtual = Estab;
              this.abrirModalReview();
            }
          },{
            text: 'Rota',
            icon: 'pin',
            handler: () => {
              this.provEstab.EstabAtual = Estab;
              this.destinationPosition = new google.maps.LatLng(this.provEstab.EstabAtual.latitude, this.provEstab.EstabAtual.longitude);
              this.VerRota();
            }
          },{
            text: 'Ofertas',
            icon: 'cart',
            handler: () => {
              this.provEstab.EstabAtual = Estab;
              this.abrirModalOfertas();
            }
          },{
            text: 'Fotos',
            icon: 'images',
            handler: () => {
              this.provEstab.EstabAtual = Estab;
              this.navCtrl.push(ImagensEstabPage);
            }
          },{
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
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

    abrirRemoverInteresses(){
      const meus_produtos = this.modal.create("ModalRemoverInteressePage",{user: 'cliente'});
      meus_produtos.present();
    }

    abrirModalProdutos(){
      const meus_produtos = this.modal.create("ModalProdutosPage",{continuar: 1, user: 'cliente'});
      meus_produtos.present();
    }


}
