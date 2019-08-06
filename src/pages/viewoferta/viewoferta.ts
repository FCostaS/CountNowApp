import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { ImageProvider } from '../../providers/image/image';
import firebase from 'firebase';
/**
 * Generated class for the ViewofertaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewoferta',
  templateUrl: 'viewoferta.html',
})
export class ViewofertaPage {

  picture: any=null;
  public loadingController: LoadingController

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public Offer: OfertaProvider,
              public img: ImageProvider,
              ) {
              //this.picture = this.downloadImageUrls('Ofertas',Offer.OfertaAtual.URL+'.jpg');
              //this.picture = this.img.picture;
  }

  private async downloadImageUrls(Paste: string, URL: string) {
     let storageRef = firebase.storage().ref()
                             .child(`${Paste}/${URL}`)
                             .getDownloadURL().then((url) => { this.picture = url; });
    }


}
