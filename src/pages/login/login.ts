import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RegisterPage } from '../register/register';
//import { UserPage } from '../user/user';
import { AuthService } from '../core/auth.service';
import { TabsPage } from '../tabs/tabs';
import { TabsShopPage } from '../tabs-shop/tabs-shop';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { GpsProvider } from '../../providers/gps/gps';
import { TabsAdminPage } from '../tabs-admin/tabs-admin';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@IonicPage({
})

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {

    loginForm: FormGroup;
    errorMessage: string = '';
    tipoConta: Number;

    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        private provider: UserMaintenance,
        public toastrService: ToastrServiceProvider,
        private GPS: GpsProvider,
        public notify: NotificationsProvider,
    ) { }

    async getLocalizacao() {
        await this.GPS.getLocalizacao();
    }

    ionViewWillLoad() {
        this.loginForm = this.formBuilder.group({
            email: new FormControl(),
            password: new FormControl(),
        });
    }

    direcionarLogin() {
        this.provider.accessUserBase().then(async snapshot => {
            this.tipoConta = this.provider.verifyUserType(snapshot);
            switch (this.tipoConta) {
                case (1):

                    await this.getLocalizacao();
                    this.provider.UpdateGPSCliente(); // Atualizando localização do cliente

                    this.provider.userIsEstab = false;
                    this.provider.UserAtual = (snapshot.child('cliente/'+this.provider.getUserKey()+'/').val());
                    this.notify.ReceberNotificacoes = this.provider.UserAtual.notificacoes;

                    this.navCtrl.push(TabsPage);
                    break;
                case (2):
                    //this.getLocalizacao();
                    this.provider.userIsEstab = true;
                    this.navCtrl.push(TabsShopPage);
                    break;
                case (3):
                    this.provider.userIsEstab = false;
                    this.navCtrl.push(TabsAdminPage);
                    break;
                default:
                    this.toastrService.ShowMSG('Usuário não cadastrado!', 3000).present();
                    //console.log("A chave dessa conta não está no banco");
            }
        })
    }

    tryLogin(value) {
        this.authService.doLogin(value)
            .then(res => {
                //console.log(res);
                this.direcionarLogin();
                //this.navCtrl.push(TabsShopPage);
            }, err => {
                console.log(err);
                this.errorMessage = err.message;
            })
    }

    tryFacebookLogin() {
        this.authService.doFacebookLogin()
            .then((res) => {
                this.direcionarLogin();
                //this.navCtrl.push(TabsPage);
            }, (err) => {
                this.errorMessage = err.message;
            });
    }

    tryGoogleLogin() {
        this.authService.doGoogleLogin()
            .then((res) => {
                this.direcionarLogin();
                //this.navCtrl.push(TabsPage);
            }, (err) => {
                this.errorMessage = err.message;
            });
    }

    goRegisterPage() {
        this.navCtrl.push(RegisterPage);
    }

    testRadioOpen: boolean;
    testRadioResult;

}
