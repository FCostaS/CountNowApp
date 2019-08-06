import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { Observable } from 'rxjs';
import { ProdutosProvider } from '../../providers/produtos/produtos';

/**
 * Generated class for the VerRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-requests',
  templateUrl: 'ver-requests.html',
})
export class VerRequestsPage {

  ListaRequests: Observable<any>;
  RequestAtual: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provRequest: RequestProvider,
              public actionSheetCtrl: ActionSheetController,
              public alerCtrl: AlertController,
              public provProduto: ProdutosProvider) {
              this.ListaRequests = this.provRequest.getAll();
              this.RequestAtual = undefined;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerRequestsPage');
  }

  ionViewDidLeave(){
    if (this.RequestAtual) this.RequestAtual.unsubscribe();
  }

  abrirRequest(request: any) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Apagar',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.doRemove(request);
          }
        },{
          text: 'Adicionar',
          handler: () => {
            var that = this;
            console.log('Archive clicked');
            this.provProduto.searchProduto().once('value', function(snapshot){
              var existe = false
              snapshot.forEach(function(snap){
                if(snap.val().nome === request.key) existe = true;
              })
              if (existe === false) that.doConfirm(request);
              else that.alreadyExists(request);
            })
          }
        },{
          text: 'Ler Descrições',
          handler: () => {
            console.log('Desc clicked');
            this.doDescriptions(request);
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

  doConfirm(request: any) {
    //console.log(this.provUser.UserAtual['nome']);
    let confirm = this.alerCtrl.create({
      title: 'Adicionar este produto?',
      message: 'Deseja adicionar '+ request.key +' no banco?',
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
            this.provProduto.saveProduto(request.key);
            this.provRequest.removeProduto(request.key);
          }
        }
      ]
    });
    confirm.present()
  }

  doRemove(request: any) {
    //console.log(this.provUser.UserAtual['nome']);
    let confirm = this.alerCtrl.create({
      title: 'Remover este produto?',
      message: 'Deseja não adicionar '+ request.key +' no banco?',
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
            if(this.RequestAtual) this.RequestAtual.unsubscribe();
            this.provRequest.removeProduto(request.key);
          }
        }
      ]
    });
    confirm.present()
  }

  alreadyExists(request: any) {
    //console.log(this.provUser.UserAtual['nome']);
    let confirm = this.alerCtrl.create({
      title: 'Duplicata',
      message: request.key +' já está no banco.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log(':(');
          }
        }
      ]
    });
    confirm.present()
  }

  doDescriptions(request: any) {
    var ListaDesc = this.provRequest.getAllDesc(request);
    var descriptions = '';

    this.RequestAtual = ListaDesc.subscribe(desc => {
      desc.map(d => {
        descriptions = descriptions + d['descricao'];
        descriptions = descriptions + '<br>';
      })
        let confirm = this.alerCtrl.create({
          title: 'Descrições',
          message: descriptions,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
              }
            }
          ]
        });
        confirm.present()
    })

  }

}
