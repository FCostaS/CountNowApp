import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { Observable } from 'rxjs';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';

/**
 * Generated class for the MostrarProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mostrar-produtos',
  templateUrl: 'mostrar-produtos.html',
})
export class MostrarProdutosPage {
  listaProdutos: Observable<any>;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provProduto: ProdutosProvider,
              public alerCtrl: AlertController,
              public provUser: UserMaintenance,
              private modal: ModalController) {

              this.listaProdutos = this.provProduto.getAll();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostrarProdutosPage');
  }

  doConfirm(produto: any, raio: number) {
    let confirm = this.alerCtrl.create({
      title: 'Adicionar este produto?',
      message: 'Deseja adicionar '+ produto.nome +' para a sua lista?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Agree clicked');
            this.provProduto.save_interest(this.provUser.getUserKey(),produto.key,produto.nome,"interesse_usuario", raio)
          }
        }
      ]
    });
    confirm.present()
  }

  showAlert() {
    const alert = this.alerCtrl.create({
      title: 'Adicionar produto',
      inputs:[
        {
          name: 'novoProduto',
          placeholder: 'Novo produto',
        }
      ],
      buttons: [
        {
          text: 'Adicionar',
          handler: data => {
            this.provProduto.add({'nome': data.novoProduto});
          }
        }
      ]
    });
    alert.present();
  }

  testarQuery(){
    this.provProduto.testeAlpha();
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
