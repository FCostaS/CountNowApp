import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { VerRequestsPage } from '../ver-requests/ver-requests';
import { UserPage } from '../user/user';
import { ProblemasRelatadosPage } from '../problemas-relatados/problemas-relatados';

/**
 * Generated class for the TabsAdminPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs-admin',
  templateUrl: 'tabs-admin.html'
})
export class TabsAdminPage {

  verRequestsRoot = VerRequestsPage;
  verProblemasRelatados = ProblemasRelatadosPage;
  userRoot = UserPage;


  constructor(public navCtrl: NavController) {}

}
