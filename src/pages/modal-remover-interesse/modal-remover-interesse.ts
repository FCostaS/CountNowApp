import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { Observable } from 'rxjs';

/**
 * Generated class for the ModalRemoverInteressePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-remover-interesse',
  templateUrl: 'modal-remover-interesse.html',
})
export class ModalRemoverInteressePage {
  addPath: string;
  listaInteresses: Observable<any>;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private view: ViewController,
              public provProdutos: ProdutosProvider,
              public alerCtrl: AlertController,
              public provUser: UserMaintenance) {
              // esse trecho serve pra controlar onde o produto sera salvo
              switch(this.navParams.get('user')){
                case('cliente'):
                  this.addPath = 'interesse_usuario/';
                  break;
                case('estab'):
                  this.addPath = 'interesse_estab/';
                  break;
                default:
                  console.log("oh shit what u doin")
              }
              this.listaInteresses = this.provProdutos.getAllInterest(this.provUser.getUserKey(),this.addPath);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalRemoverInteressePage');
  }

  doDelete(interesse: any) {
    let confirm = this.alerCtrl.create({
      title: 'Remover este produto?',
      message: 'Deseja retirar '+ interesse.produto +' da sua lista?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.provProdutos.remove_interest(interesse,this.addPath)
          }
        }
      ]
    });
    confirm.present()
  }

  closeModal(){
    this.view.dismiss();
  }

}
