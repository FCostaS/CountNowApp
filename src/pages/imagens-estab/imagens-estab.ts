import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { EstabImagemProvider } from '../../providers/estabimagens/estabimagens';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { Observable } from 'rxjs';

/**
 * Generated class for the ImagensEstabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imagens-estab',
  templateUrl: 'imagens-estab.html',
})
export class ImagensEstabPage {

  ListaImg: Observable<any>;
  imagemNova: HTMLImageElement;
  showEstabInfo: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public estabProvider: EstabProvider,
              public imgestabProvider: EstabImagemProvider,
              public userProv: UserMaintenance,
              public actionSheetCtrl: ActionSheetController,
              ) {
                if(this.userProv.userIsEstab)
                  this.ListaImg = this.imgestabProvider.getAllEstab(this.userProv.getUserKey());
                else //isso n faz sentido mas coloquei aqui pra lembrar de arumar depois
                  this.ListaImg = this.imgestabProvider.getAllEstab(this.estabProvider.EstabAtual.key);
                this.showEstabInfo = this.userProv.userIsEstab;
                console.log(this.userProv.userIsEstab , this.showEstabInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagensEstabPage');
  }

  addImage(){
    var teste = new Image();
    teste.src = 'https://firebasestorage.googleapis.com/v0/b/countnow-33a33.appspot.com/o/Ofertas%2F15366052203710f49-306c.jpg?alt=media&token=db5cfa2c-1b39-4df2-9477-cdee11424ba2'
    this.imgestabProvider.save(teste.src, this.userProv.getUserKey());
  }

  addImage2(){
    var teste = new Image();
    teste.src = 'https://firebasestorage.googleapis.com/v0/b/countnow-33a33.appspot.com/o/Ofertas%2F1542429243697e65b-71f6.jpg?alt=media&token=4902b68d-6744-40ce-ad80-92417077101a'
    this.imgestabProvider.save(teste.src, this.userProv.getUserKey());
  }

  addImage3(){
    var teste = new Image();
    teste.src = 'https://firebasestorage.googleapis.com/v0/b/countnow-33a33.appspot.com/o/Ofertas%2Fvinho.jpg?alt=media&token=faca03ae-3b72-4ca5-9aaa-38f6722cc351'
    this.imgestabProvider.save(teste.src, this.userProv.getUserKey());
  }

  actionSheetImagem(imagem){
    if(this.userProv.userIsEstab){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.imgestabProvider.remove(imagem.key, this.userProv.getUserKey());
            this.userProv.checarAvatar(this.userProv.getUserKey(), imagem.img);
          }
        },{
          text: 'Nova foto de perfil',
          handler: () => {
            console.log('Archive clicked');
            this.userProv.trocarAvatar(this.userProv.getUserKey(), imagem.img);
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
  }}
}
