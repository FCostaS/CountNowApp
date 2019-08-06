import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-produtos',
    templateUrl: 'produtos.html',
})
export class ProdutosPage {

    formInserirProduto: FormGroup;
    formDeclararInteresse: FormGroup;
    public dbRef;
    ListaProdutos: Observable<any>;
    tipoConta: Number;
    //produtosDeInteresse: Array<String>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public db: AngularFireDatabase,
        private userProvider: UserMaintenance,
        private produtosProvider: ProdutosProvider,
        private toastrService: ToastrServiceProvider
    ) {

        this.formInserirProduto = this.formBuilder.group({
            nome: new FormControl()
        });

        this.formDeclararInteresse = this.formBuilder.group({
            produto: new FormControl()
        });

        this.ListaProdutos = this.produtosProvider.getAll();

        this.dbRef = db;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProdutosPage');
        this.userProvider.accessUserBase().then(snapshot => {
            this.tipoConta = this.userProvider.verifyUserType(snapshot);
            switch (this.tipoConta) {
                case (1):
                    //cliente
                    this.MostrarElemento('mostrarProdutos');
                    break;
                case (2):
                    //estabelecimento
                    this.MostrarElemento('formInserirProduto');
                    break;
                default:
                    this.toastrService.ShowMSG('Usuário não cadastrado!', 3000).present();
                //console.log("A chave dessa conta não está no banco");
            }
        })
    }

    EsconderElemento(idElemento) {
        document.getElementById(idElemento).hidden = true;
    }

    MostrarElemento(idElemento) {
        document.getElementById(idElemento).hidden = false;
    }

    InserirProduto(value) {
        this.produtosProvider.add(value);
        this.toastrService.ShowMSG('Produto Salvo', 3000).present();
        this.navCtrl.push(ProdutosPage);
    }

    AdicionarProdutoInteresse(idElemento, nomeElemento) {
        var user_id = firebase.auth().currentUser.uid;
        this.produtosProvider.save_interest(user_id, idElemento, nomeElemento,"", 10);

        this.EsconderElemento(idElemento + "-adicionar");
        this.MostrarElemento(idElemento + "-remover");
    }

    //RemoverProdutoInteresse(idElemento) {
    //    var user_id = firebase.auth().currentUser.uid;
    //    this.produtosProvider.remove_interest(user_id, idElemento);

    //    this.MostrarElemento(idElemento + "-adicionar");
    //    this.EsconderElemento(idElemento + "-remover");
    //}

    verificar(id, nome) {
        var existe = firebase.database().ref("interesse_usuario").once('value').then(snapshot => (snapshot.child(user_id + "/" + id).exists()));
        var user_id = firebase.auth().currentUser.uid;

        if (existe) {
            this.MostrarElemento(id + "-remover");
        }
        else {
            this.MostrarElemento(id + "-adicionar");
        }

    }

    DeclararInteresse(value) {
        alert(value.produto);

        //alert(value.entries);
    }

}
