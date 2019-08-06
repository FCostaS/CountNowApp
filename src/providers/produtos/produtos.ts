import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { UserMaintenance } from '../firebase-service/user_maintenance';
import { GpsProvider } from '../../providers/gps/gps';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@Injectable()
export class ProdutosProvider {

    contagemInteresse: any;
    produtoAtual: any;
    interesseAtual: any;
    interesseMostrar: any;
    newProdut: boolean;
    ListaInteresse = [];

    private PATH = 'produtos/';
    constructor(private db: AngularFireDatabase,
                public provUser: UserMaintenance,
                private GPS: GpsProvider,
                public notify: NotificationsProvider){
        this.contagemInteresse = {};
        this.interesseMostrar = {};
    }

    testeAlpha() {
      var temp = firebase.database().ref("produtos");
      temp.orderByChild("nome").on("child_added",function(snapshot){
        console.log(snapshot.val().nome);
      })
    }

    testeBlanco() {
      var temp = firebase.database().ref("interesse_usuario");
      temp.orderByChild("produto").on("child_added",function(snapshot){
        console.log(snapshot.val().produto);
      })
    }

    //Atualiza dicionario do provedor com contagem de todos interesses por produto
    //chave: chave do produto, valor: n de interesses no produto
    updateContagem(){
      var that = this // AHAHAHAHAHA
      var ref = firebase.database().ref("interesse_usuario/");
      var dic = ref.orderByChild("produto_id").once("value",function(snapshot){
        var contagemInteresse = {};
        snapshot.forEach(function(snapshotContagem){
          contagemInteresse[snapshotContagem.val().produto_id] = (contagemInteresse[snapshotContagem.val().produto_id] || 0)+1;
        })
          //console.log(contagemInteresse);
         that.contagemInteresse = contagemInteresse;
      })
    }

    updateContagemConsiderandoRaio(){
      var objeto = this;
      var refInteresseUsuario = firebase.database().ref("interesse_usuario/");
      refInteresseUsuario.orderByChild("produto_id").once("value",function(snapshotInteresse){
        var contagemInteresse = {};
        snapshotInteresse.forEach(function(item){
          if(item.val().raio && Number(item.val().raio)  + 6000 >= objeto.GPS.getDistancia(item.val().user_lat, item.val().user_long))/*Corrigir o 6000, colocado para dar a distancia*/
            contagemInteresse[item.val().produto_id] = (contagemInteresse[item.val().produto_id] || 0)+1;
        });
         objeto.contagemInteresse = contagemInteresse;
      });
    }

    // atualiza lista com interesses do usuario atual
    updateInteresses(userKey: string, path: string){
      var that = this // WAKE ME UP, BEFORE YOU GO GO
      var ref = firebase.database().ref(path); //path -> onde esta os interesses
      ref.orderByChild("user_id").startAt(userKey).endAt(userKey).once("value",function(snapshot){
        var listaInteresses = [];
        snapshot.forEach(function(snapshotInteresses){
          listaInteresses.push(snapshotInteresses.val().produto_id);
        })
        console.log(listaInteresses);

        var refProd = firebase.database().ref("produtos/");
        refProd.once("value",function(snapshotProduto){
          var mostrar = {};
          snapshotProduto.forEach(function(produto){
            var aux = listaInteresses.find(function(element){
              return element===produto.key;
            })

            if(aux) mostrar[produto.key] = true;

          })
          that.interesseMostrar = mostrar;
        })

        //for (var i = 0; i < listaInteresses.length; i++){
        //  console.log(listaInteresses[i]);
        //}
        //that.interesseAtual = listaInteresses;
      })
    }

    getAll() {
        return this.db.list(this.PATH, ref => ref.orderByChild("nome"))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    //igual getAll mas com contagem de interesse tbm
    getAllContagem() {
      this.updateContagem();
      this.updateInteresses(this.provUser.getUserKey(),"interesse_estab");
      //console.log(this.contagemInteresse);
      return this.db.list(this.PATH, ref => ref.orderByChild("contagem"))
          .snapshotChanges()
          .map(changes => {
              return changes.map(c => ({
                key: c.payload.key,
                contagem: this.contagemInteresse[c.payload.key],
                mostrar: this.interesseMostrar[c.payload.key],
                ...c.payload.val() }));
          })
    }

    getAllContagemConsiderandoRaio() {
      this.updateContagemConsiderandoRaio();
      this.updateInteresses(this.provUser.getUserKey(),"interesse_estab");
      //console.log(this.contagemInteresse);
      return this.db.list(this.PATH, ref => ref.orderByChild("contagem"))
          .snapshotChanges()
          .map(changes => {
              return changes.map(c => ({
                key: c.payload.key,
                contagem: this.contagemInteresse[c.payload.key],
                mostrar: this.interesseMostrar[c.payload.key],
                ...c.payload.val() }));
          })
    }

    get(key: string) {
        return this.db.object(this.PATH + key)
            .snapshotChanges()
            .map(c => {
                return { key: c.key, ...c.payload.val() };
            })
    }

    getAllInterest(userKey: string, path: string){
        return this.db.list(path, ref => ref
        .orderByChild("user_id")
        .startAt(userKey)
        .endAt(userKey))
        .snapshotChanges()
        .map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
    }

    getAll_interest(user_id: string){
      return this.db.list("interesse_usuario/"+user_id+"/", ref => ref.orderByChild("produto"))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}));
      })
    }

    add(value) {
        this.db.list(this.PATH).push({ nome: value.nome });
    }

    saveProduto(produto: string) {
        this.db.list(this.PATH).push({ nome: produto });
    }

    searchProduto(){
      return firebase.database().ref('produtos/'); //path -> onde esta os interesses
    }

    save_interest(user_id, product_id, product_name, path, raio) {

        if(raio != null)//salvar interesse de um cliente
        {
          this.db.list(path)
          .push({ produto: product_name,
                    user_id: user_id,
                    produto_id: product_id,
                    user_lat: this.provUser.UserAtual['latitude'],
                    user_long: this.provUser.UserAtual['longitude'],
                    raio: raio
                  });
        }else //salvar interesse de um estabelecimento
        {
          this.db.list(path)
          .push({ produto: product_name,
                    user_id: user_id,
                    produto_id: product_id
                  });
        }
        //this.incNumInteresses(product_id);
    }

    remove_interest(interest,path) {
        this.db.list(path).remove(interest.key);
        //this.decNumInteresses(interest.produto_id);
    }

    //metodos para controlar contagem, n sei se vai usar

    incNumInteresses(product_key: string){
        var ref = firebase.database().ref('produtos/'+ product_key +'/nInteressados');
        ref.transaction(function(currentNum){
          return (currentNum || 0) + 1;
        })
    }

    decNumInteresses(product_key: string){
        var ref = firebase.database().ref('produtos/'+ product_key +'/nInteressados');
        ref.transaction(function(currentNum){
          return (currentNum || 0) - 1;
        })
    }

    //save_interest(user_id, product_id, product_name) {
    //    this.db.list("interesse_usuario/" + user_id + "/" + product_id).push({ produto: product_name });
    //}

    save(produto: any) {
        return new Promise((resolve, reject) => {
            if (produto.key) { // Existe chave -> Atualizar
                this.db.list(this.PATH)
                    .update(produto.key, {
                        Descricao: produto.Descricao,
                        EstoqueInicial: produto.EstoqueInicial,
                        Fim: produto.Fim,
                        Inicio: produto.Inicio,
                        Preco: produto.Preco,
                        Produto: produto.Produto
                    })
                    .then(() => resolve())
                    .catch((e) => reject(e));

            } else { // Nao existe chave -> Inserir
                this.db.list(this.PATH)
                    .push({
                        Descricao: produto.Descricao,
                        EstoqueInicial: produto.EstoqueInicial,
                        Fim: produto.Fim,
                        Inicio: produto.Inicio,
                        Preco: produto.Preco,
                        Produto: produto.Produto
                    })
                    .then(() => resolve());
            }
        });
    }

    remove(key: string) {
        return this.db.list(this.PATH).remove(key);
    }

    /////////////////////////
    async ProdutoNotifications(userkey: string){
      var query = firebase.database()
                  .ref('interesse_usuario')
                  .orderByChild('user_id').equalTo(userkey);

      // Pegando lista de produto dos usuarios
      let ListProducts = [];
        await query.once('value', function (snapshot) {
            snapshot.forEach(childSnapshot => {
                let item = childSnapshot.val();
                item.key = childSnapshot.key;
                ListProducts.push(item);
            });
        })

      //
      for(let i in ListProducts)
      {
          var query = firebase.database()
                              .ref('/Ofertas')
                              .orderByChild('ProdutoId')
                              .equalTo(ListProducts[i].produto_id);

            // Pegando lista de produto dos usuarios
            let array = [];
            await query.once('value', function (snapshot) {
                snapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    array.push(item);
                });
            })

            if( array.length > 0 )
            {
              this.newProdut = true;
              for(let i in array)
              {
                    this.ListaInteresse.push(array[i]);
              }
              this.notify.SendNotification(2); // Enviar notificacao
              //break;
            }
                else
                {
                  this.newProdut = false;
                }
      }
        return await this.ListaInteresse;
    }

}
