import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

/**
 * Generated class for the InserirSolitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inserir-solit',
  templateUrl: 'inserir-solit.html',
})
export class InserirSolitPage {

  requestForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provRequest: RequestProvider,
              public formBuilder: FormBuilder) {
              this.requestForm = this.formBuilder.group({
                produto: new FormControl(),
                descricao: new FormControl(),
              })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InserirSolitPage');
  }

  submeterSolit(request: any){
    this.provRequest.save(request);
    this.navCtrl.pop();
  }

}
