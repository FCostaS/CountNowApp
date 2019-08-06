import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { RelatarProblemaProvider } from '../../providers/relatar-problema/relatar-problema';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';

/**
 * Generated class for the ProblemasRelatadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-problemas-relatados',
  templateUrl: 'problemas-relatados.html',
})
export class ProblemasRelatadosPage {
  problemasRelatados: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public providerRelatarProblemas: RelatarProblemaProvider,
    public toastrService: ToastrServiceProvider
  ){
        this.problemasRelatados = this.providerRelatarProblemas.getAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProblemasRelatadosPage');
  }

  removerRelato(problema){
    this.providerRelatarProblemas.remove(problema);
    this.toastrService.ShowMSG('Removido!', 3000).present();
  }

}
