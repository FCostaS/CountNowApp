import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReviewProvider } from '../../providers/reviews/reviews';
import { Observable } from 'rxjs/Observable';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';

/**
 * Generated class for the ModalOfertasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-ofertas',
  templateUrl: 'modal-ofertas.html',
})
export class ModalOfertasPage {
  ListaOfertas: Observable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private view: ViewController,
              public provOfertas: OfertaProvider,
              public provEstab: EstabProvider) {
    this.ListaOfertas = this.provOfertas.getAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalOfertasPage');
  }

  closeModal(){
    this.view.dismiss();
  }

}
