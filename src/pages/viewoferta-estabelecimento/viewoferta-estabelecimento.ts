import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, ModalController} from 'ionic-angular';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { ImageProvider } from '../../providers/image/image';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { Camera } from '@ionic-native/camera';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the ViewofertaEstabelecimentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewoferta-estabelecimento',
  templateUrl: 'viewoferta-estabelecimento.html',
})
export class ViewofertaEstabelecimentoPage {

  picture: any=null;
  public loadingController: LoadingController
  private PATH = 'Ofertas/';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public Offer: OfertaProvider,
              public img: ImageProvider,
              public dbService: FirebaseServiceProvider,
              public toastrService: ToastrServiceProvider,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public provOferta: OfertaProvider,
              public provProduto: ProdutosProvider,
              private modal: ModalController,
              private userMaintenance: UserMaintenance,
              public loadingCtrl: LoadingController,
              private db: AngularFireDatabase,
              ) {
              //this.picture = this.downloadImageUrls('Ofertas',Offer.OfertaAtual.URL+'.jpg');
              //this.picture = this.img.picture;
  }

  private async downloadImageUrls(Paste: string, URL: string) {
     let storageRef = firebase.storage().ref()
                             .child(`${Paste}/${URL}`)
                             .getDownloadURL().then((url) => { this.picture = url; });
    }

    Update (oferta) {
        return new Promise((resolve, reject) => {
            if (oferta.key) { // Existe chave -> Atualizar
                this.db.list(this.PATH)
                    .update(oferta.key, {
                      Status: oferta.Status,})
                    .then(() => resolve())
                    .catch((e) => reject(e));

            }
        });
    }


}
