import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RelatarProblemaProvider } from '../../providers/relatar-problema/relatar-problema';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { UserPage } from '../user/user';


@IonicPage()
@Component({
  selector: 'page-relatar-problemas',
  templateUrl: 'relatar-problemas.html',
})
export class RelatarProblemasPage {
  relatarProblemasForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public toastrService: ToastrServiceProvider,
    public providerRelatarProblemas: RelatarProblemaProvider,
  )
    {
      this.relatarProblemasForm = this.formBuilder.group({
          assunto: new FormControl(),
          descricao: new FormControl()
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatarProblemasPage');
  }

  relatarProblemas(formValue){
    this.providerRelatarProblemas.inserir(formValue);
    this.toastrService.ShowMSG('Problema relatado. Obrigado!', 3000).present();
    this.navCtrl.push(UserPage);
  }

}
