import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { FirebaseUserModel } from '../core/user.model';
import { GpsProvider } from '../../providers/gps/gps';
//import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { InserirSolitPage } from '../inserir-solit/inserir-solit';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { RelatarProblemasPage } from '../relatar-problemas/relatar-problemas';
import { ImagensEstabPage } from '../imagens-estab/imagens-estab';

@Component({
    selector: 'page-user',
    templateUrl: 'user.html'
})

export class UserPage {

    user: FirebaseUserModel = new FirebaseUserModel();
    showImage: boolean;

    constructor(
        public navCtrl: NavController,
        public userService: UserService,
        public authService: AuthService,
        private GPS: GpsProvider,
        public provUser: UserMaintenance,
        public notify: NotificationsProvider,
        public modal: ModalController,
        //private estabProvider: EstabProvider,
    ){
      //notify.SendNotification(2);
      if(this.provUser.userIsEstab) this.showImage = true;
      else this.showImage = false;
  }

    ionViewWillLoad() {
        this.userService.getCurrentUser()
            .then(user => {
                this.user = user;
            }, err => console.log(err));
    }

    updateNotification(){
      this.provUser.UpdateNotification(this.notify.ReceberNotificacoes);
      // Atualizar notificações
    }

    gotoImages(){
      this.navCtrl.push(ImagensEstabPage);
    }

    abrirSolit(){
      this.navCtrl.push(InserirSolitPage);
    }

    relatarProblemas(){
      this.navCtrl.push(RelatarProblemasPage);
    }

    logout(){
        this.authService.doLogout()
            .then((res) => {
                this.navCtrl.parent.parent.setRoot('LoginPage');
            }, (error) => {
                console.log("Logout error", error);
            });
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
