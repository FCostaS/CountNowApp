//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { GpsProvider } from '../../providers/gps/gps';
//import { EstabProvider } from '../estabelecimentos/estabelecimentos';

@Injectable()
export class UserMaintenance {
    private dbRef;
    public UserKey;
    public UserAtual = null ;
    public userIsEstab: boolean;
    public stockAvatar: string;

    constructor(
        public db: AngularFireDatabase,
        private GPS: GpsProvider,
        //public provEstab: EstabProvider,
    ) {
        this.dbRef = this.db;
        this.stockAvatar = "https://firebasestorage.googleapis.com/v0/b/countnow-33a33.appspot.com/o/Estabelecimentos%2Fplaceholder.png?alt=media&token=7bfaf04b-2ce0-4639-aae2-e300a3fd9e9f";
    }

    getAll() {
        return this.dbRef.snapshotChanges().map(data => {
            return data.map(d => ({ key: d.key, ...d.payload.val() }));
        });
    }

    add_user(user: any, tipo_usuario) {

        var user_id = firebase.auth().currentUser.uid;

        if (tipo_usuario === "cliente" || tipo_usuario === "admin") {
            return this.dbRef.object('usuarios/'+ tipo_usuario + '/' + user_id).set(user);
        }
        else if (tipo_usuario == "estabelecimento") {
            user['nAvals'] = 0;
            user['media'] = 0;
            var endereco = user.endereco + "," + user.cidade + "," + user.estado;

            this.GPS.getLocalizacaoPorEndereco(endereco);

            user.latitude = this.GPS.Localizacao.latitude;
            user.longitude = this.GPS.Localizacao.longitude;

            return this.dbRef.object('usuarios/estabelecimento/' + user_id).set(user);
        }
        return null;
    }

    accessUserBase() {
        var ref = firebase.database().ref('usuarios');
        return ref//.child('cliente/')
            .once('value');
    }

    incNumAval(estabKey: string){
        console.log("here here");
        var ref = firebase.database().ref('usuarios/estabelecimento/'+estabKey+'/nAvals');
        ref.transaction(function(currentNum){
          return (currentNum || 0) + 1;
        })
    }

    // IMAGENS DO ESTABELECIMENTO \\------------------------------
    inrementarNumImagens(estabKey: string){
      var ref = firebase.database().ref('usuarios/estabelecimento/'+estabKey+'/numImagens');
      ref.transaction(function(currentNum){
        return (currentNum || 0) + 1;
      })
    }

    decrementarNumImagens(estabKey: string){
      var ref = firebase.database().ref('usuarios/estabelecimento/'+estabKey+'/numImagens');
      ref.transaction(function(currentNum){
        return (currentNum || 1) - 1;
      })
    }

    trocarAvatar(estabKey: string, novoURL: string){
      var ref = firebase.database().ref('usuarios/estabelecimento/'+estabKey+'/avatar');
      ref.transaction(function(currentURL){
        return novoURL;
      })
    }

    checarAvatar(estabKey: string, deletedURL: string){
      var estabRef = firebase.database().ref('usuarios/estabelecimento/'+estabKey);
      var objeto = this;
      estabRef.once('value', function(snapshot){
        if(snapshot.val().numImagens === 0 || snapshot.val().avatar === deletedURL){
          objeto.trocarAvatar(estabKey, objeto.stockAvatar);
        }
      })
    }
    // FIM IMAGENS DO ESTABELECIMENTO-----------------------------

    incrementarMedia(estabKey:string, notaNova: number){
      var estabRef = firebase.database().ref('usuarios/estabelecimento/'+estabKey);
      estabRef.transaction(function(estab){
        var estabUpdate = estab;
        estabUpdate['nAvals'] = (estab['nAvals'] || 0);
        estabUpdate['media'] = (estab['media'] || 0);
        var mediaTotal = estabUpdate['nAvals'] * estabUpdate['media']
        estabUpdate['nAvals'] += 1;
        estabUpdate['media'] = ((mediaTotal+notaNova)/estabUpdate['nAvals']).toFixed(2);
        return estabUpdate;
      })
    }

    atualizarMedia(estabKey:string, notaNova: number, notaAntiga){
      var estabRef = firebase.database().ref('usuarios/estabelecimento/'+estabKey);
      estabRef.transaction(function(estab){
        var estabUpdate = estab;
        estabUpdate['nAvals'] = (estab['nAvals'] || 0);
        estabUpdate['media'] = (estab['media'] || 0);
        var mediaTotal = estabUpdate['nAvals'] * estabUpdate['media']
        //estabUpdate['nAvals'] += 1;
        estabUpdate['media'] = ((mediaTotal+notaNova-notaAntiga)/estabUpdate['nAvals']).toFixed(2);
        return estabUpdate;
      })
    }

    verifyUserType(snapshot) {
        var chave = firebase.auth().currentUser.uid;
        //console.log(chave);
        this.UserKey = chave;
        if (snapshot.child('cliente/' + chave).exists()) {
            return 1;
        } else if (snapshot.child('estabelecimento/' + chave).exists()) {
            return 2;
        } else if (snapshot.child('admin/'+ chave).exists()) {
            return 3;
        }
        return 0;
    }

    getUserKey() {
        return (firebase.auth().currentUser.uid);
    }

    async UpdateGPSCliente(){
        await this.dbRef.object('usuarios/cliente/' + this.UserKey).update(this.GPS.Localizacao).
        catch((error: any) => console.log(error));
    }

    async UpdateNotification(notification){
      var Notificacao = {
          'notificacoes': null,
        }
      Notificacao.notificacoes = notification;
        await this.dbRef.object('usuarios/cliente/' + this.UserKey).update(Notificacao).
        catch((error: any) => console.log(error));
    }

    getRef(path: string){
      return firebase.database().ref(path);
    }

    update_user(Oferta) {

    }

    remove_user(Oferta) {

    }

}
