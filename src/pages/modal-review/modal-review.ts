import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReviewProvider } from '../../providers/reviews/reviews';
import { Observable } from 'rxjs/Observable';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';

/**
 * Generated class for the ModalReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-review',
  templateUrl: 'modal-review.html',
})
export class ModalReviewPage {
  ListaReviews: Observable<any>;
  ListaOfertas: Observable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provReview: ReviewProvider,
              private view: ViewController,
              public provOfertas: OfertaProvider,
              public provEstab: EstabProvider) {
    this.ListaReviews = this.provReview.getAll_defined(this.provEstab.EstabAtual.key);
    this.ListaOfertas = this.provOfertas.getAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalReviewPage');
  }

  closeModal(){
    this.view.dismiss();
  }

}
