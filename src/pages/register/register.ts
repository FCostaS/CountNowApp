import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../core/auth.service';

import { UserPage } from '../user/user';

import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { LoginPage } from '../login/login';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    infoEstabelecimento: any;
    infoCliente: boolean;

    registerForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    tipoCadastro: number;

    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public formBuilder: FormBuilder,
        public userService: UserMaintenance,
        public toastrService: ToastrServiceProvider,
        public notify: NotificationsProvider,
    ) {

        this.registerForm = this.formBuilder.group({
            email: new FormControl(),
            password: new FormControl(),
            nome: new FormControl(),
            cpf: new FormControl(),
            cnpj: new FormControl(),
            categoria: new FormControl(),
            estado: new FormControl(),
            cidade: new FormControl(),
            endereco: new FormControl()
        });
        this.infoCliente = true;
        this.tipoCadastro = 0;
    }

    tryRegister(value) {
        switch(this.tipoCadastro){
            case 1: // conta de cliente ----------------------------------------
              if (value.cpf != "") {
                  this.authService.doRegister(value)
                      .then(res => {

                          this.userService.add_user({ nome: value.nome, cpf: value.cpf, estado: value.estado, cidade: value.cidade, endereco: value.endereco, notificacoes: this.notify.ReceberNotificacoes }, "cliente");

                          this.toastrService.ShowMSG('Usuário cadastrado, faça o Login!', 3000).present();
                          this.navCtrl.push(LoginPage);

                      }, err => {
                          this.errorMessage = err.message;
                          this.successMessage = "";
                      })
              }
              else {
                  this.toastrService.ShowMSG('Você precisa inserir o CPF!', 3000).present();
              }
              break;

            case 2: // conta de estab ------------------------------------------
              if (value.cnpj != null && value.cpf != "") {
                  this.authService.doRegister(value)
                      .then(res => {

                          this.userService.add_user({ nome: value.nome, cnpj: value.cnpj, estado: value.estado, cidade: value.cidade, endereco: value.endereco, categoria: value.categoria }, "estabelecimento");
                          this.errorMessage = "";
                          this.successMessage = "Your account has been created. Please log in now.";
                          this.toastrService.ShowMSG('Usuário cadastrado, faça o Login!', 3000).present();
                          this.navCtrl.push(LoginPage);

                      }, err => {
                          this.errorMessage = err.message;
                          this.successMessage = "";
                      })
              }
              else {
                  this.toastrService.ShowMSG('Você precisa inserir o CNPJ!', 3000).present();
              }
              break;

            case 3: // conta de admin-------------------------------------------
                  this.authService.doRegister(value)
                      .then(res => {

                          this.userService.add_user({ nome: value.nome, estado: value.estado, cidade: value.cidade, endereco: value.endereco }, "admin");

                          this.toastrService.ShowMSG('Usuário cadastrado, faça o Login!', 3000).present();
                          this.navCtrl.push(LoginPage);

                      }, err => {
                          this.errorMessage = err.message;
                          this.successMessage = "";
                      })
              break;
            default:
              this.toastrService.ShowMSG('Escolha um tipo de conta',3000).present();
        }

    }

    tryFacebookLogin(value) {

        if (this.infoCliente == true) {
            if (value.cpf != null && value.cpf != "") {
                this.authService.doFacebookLogin()
                    .then((res) => {
                        this.userService.add_user({ cpf: value.cpf, estado: value.estado, cidade: value.cidade, endereco: value.endereco }, "cliente");
                        this.toastrService.ShowMSG('Cadastro realizado com sucesso, faça o login!', 3000).present();
                        this.navCtrl.push(LoginPage);
                    }, (err) => {
                        this.errorMessage = err.message;
                    });
            }
            else {
                this.toastrService.ShowMSG('Você precisa inserir o CPF!', 3000).present();
            }

        }
        else {
            if (value.cnpj != null && value.cpf != "") {
                this.authService.doFacebookLogin()
                    .then((res) => {
                        this.userService.add_user({ cnpj: value.cnpj, estado: value.estado, cidade: value.cidade, endereco: value.endereco, categoria: value.categoria }, "estabelecimento");
                        this.toastrService.ShowMSG('Cadastro realizado com sucesso, faça o login!', 3000).present();
                        this.navCtrl.push(LoginPage);
                    }, (err) => {
                        this.errorMessage = err.message;
                    });
            }
            else {
                this.toastrService.ShowMSG('Você precisa inserir o CNPJ!', 3000).present();
            }
        }

    }

    tryGoogleLogin(value) {

        if (this.infoCliente == true) {
            if (value.cpf != null && value.cpf != "") {
                this.authService.doGoogleLogin()
                    .then((res) => {
                        this.userService.add_user({ cpf: value.cpf, estado: value.estado, cidade: value.cidade, endereco: value.endereco }, "cliente");
                        this.toastrService.ShowMSG('Cadastro realizado com sucesso, faça o login!', 3000).present();
                        this.navCtrl.push(LoginPage);
                    }, (err) => {
                        this.errorMessage = err.message;
                    });
            }
            else {
                this.toastrService.ShowMSG('Você precisa inserir o CPF!', 3000).present();
            }

        }
        else {
            if (value.cnpj != null && value.cpf != "") {
                this.authService.doGoogleLogin()
                    .then((res) => {
                        this.userService.add_user({ cnpj: value.cnpj, estado: value.estado, cidade: value.cidade, endereco: value.endereco, categoria: value.categoria }, "estabelecimento");
                        this.toastrService.ShowMSG('Cadastro realizado com sucesso, faça o login!', 3000).present();
                        this.navCtrl.push(LoginPage);
                    }, (err) => {
                        this.errorMessage = err.message;
                    });
            }
            else {
                this.toastrService.ShowMSG('Você precisa inserir o CNPJ!', 3000).present();
            }
        }

    }

    goLoginPage() {
        this.navCtrl.pop();
    }

    esconderForm(infC, infE) {
        this.infoCliente = infC;
        this.infoEstabelecimento = infE;
    }

    atualizarForm(tipo: number){
      // 1 -> Cliente
      // 2 -> Estabelecimento
      // 3 -> Admin
      this.tipoCadastro = tipo;
      switch(tipo){
        case 1:
          this.esconderForm(true,false);
          break;
        case 2:
          this.esconderForm(false,true);
          break;
        case 3:
          this.esconderForm(false,false);
          break;
        default:
          console.log("????????");
      }
    }

}
