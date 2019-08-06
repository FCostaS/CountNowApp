import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    userTeste: any;
    constructor(public navCtrl: NavController,
        private provider: UserMaintenance,) {
    }

    goToRegisterPage() {
        this.navCtrl.push(RegisterPage)
    }

    goToLoginPage() {
        this.navCtrl.push(LoginPage)
    }

}
