import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';

/**
 * Generated class for the ModalProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-produtos',
  templateUrl: 'modal-produtos.html',
})
export class ModalProdutosPage {
  ListaProdutos: Observable<any>;
  addPath: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private view: ViewController,
              public provProdutos: ProdutosProvider,
              public alerCtrl: AlertController,
              public provUser: UserMaintenance) {
              this.ListaProdutos = this.provProdutos.getAll();
              //console.log(this.navParams.get('user'));
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
  }

  clicarProduto(produto: any, raio: number){
    switch(this.navParams.get('continuar')){
      case(0):
        //this.provProdutos.produtoAtual = produto;
        this.confirmarProduto(produto);
        break;

      case(1):
        this.doConfirm(produto);
        break;

      default:
        console.log("Parametro errado");
    }
  }

  confirmarProduto(produto: any){
    let confirm = this.alerCtrl.create({
      title: 'Escolher este produto?',
      message: 'Deseja colocar '+ produto.nome +' em oferta?',
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
            //console.log('Agree clicked');
            this.provProdutos.produtoAtual = produto;
            this.closeModal();
          }
        }
      ]
    });
    confirm.present()
  }

 doConfirm(produto: any) {
    //console.log(this.provUser.UserAtual['nome']);
    var respostaBotao = false;
    if(this.navParams.get('user') == 'cliente')//tratar para quando um cliente indicar interesse
    {
      let confirm = this.alerCtrl.create({
        title: 'Adicionar este produto?',
        inputs: [
          {
            name: 'raio',
            placeholder: 'Raio de interesse em km, ex: 2'
          }
        ],
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
            handler: (data) => {
              console.log('Agree clicked');
              this.provProdutos.save_interest(this.provUser.getUserKey(),produto.key,produto.nome,this.addPath, data.raio);
            }
          }
        ]
      });
      confirm.present();
    }else if(this.navParams.get('user') == 'estab')// //tratar para quando um estabelecimento indicar interesse
    {
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
            handler: (data) => {
              console.log('Agree clicked');
              this.provProdutos.save_interest(this.provUser.getUserKey(),produto.key,produto.nome,this.addPath, null);
            }
          }
        ]
      });
      confirm.present();
    }



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProdutosPage');
  }

  closeModal(){
    this.view.dismiss();
  }

}
