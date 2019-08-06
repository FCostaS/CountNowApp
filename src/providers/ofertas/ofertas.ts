import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProdutosProvider } from '../produtos/produtos';
import * as firebase from 'firebase/app';
import { UserMaintenance } from '../firebase-service/user_maintenance';
import { EstabProvider } from '../estabelecimentos/estabelecimentos';
import { GpsProvider } from '../gps/gps';

@Injectable()
export class OfertaProvider {

    mostrarOferta: any;
    filtrarInt: boolean;
    filtrarData: boolean;
    filtrarGrupo: boolean;
    filtrarDistancia: boolean;
    existeOferta: boolean;

    private PATH = 'Ofertas/';
    public OfertaAtual = null;
    constructor(private db: AngularFireDatabase,
        public provProduto: ProdutosProvider,
        public estabProvider: EstabProvider,
        public GPS: GpsProvider,
        public provUser: UserMaintenance) {

        this.mostrarOferta = {};
        this.filtrarInt = false;
        this.filtrarData = false;
        this.filtrarGrupo = false;
        this.filtrarDistancia = false;
    }

    updateMostra(userKey: string) {
        var that = this;
        var ref = firebase.database().ref("interesse_usuario/");
        ref.orderByChild("user_id").startAt(userKey).endAt(userKey).once("value", function(snapshot) {
            var listaInteresses = [];
            snapshot.forEach(function(snapshotInteresses) {
                listaInteresses.push(snapshotInteresses.val().produto_id);
            })
            //console.log(listaInteresses);

            var refOferta = firebase.database().ref("Ofertas/");
            refOferta.once("value", function(snapshotOferta) {
                var mostrar = {};
                snapshotOferta.forEach(function(oferta) {
                    var aux = listaInteresses.find(function(element) {
                        return element === oferta.val().ProdutoId;
                    });

                    if (aux) // verdadeiro se a variavel n eh undefined
                        mostrar[oferta.key] = true;
                })
                //console.log(mostrar);
                that.mostrarOferta = mostrar;
            })
        })
    }

    getAllFiltro(userkey, data, grupo, distanciaMaxima) {
        this.updateMostraFiltro(userkey, data, grupo, distanciaMaxima);
        return this.db.list(this.PATH, ref => ref.orderByChild("Produto"))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({
                    key: c.payload.key,
                    mostrar: this.mostrarOferta[c.payload.key],
                    ...c.payload.val()
                }));
            })
    }

    updateMostraFiltro(userKey: string, data: string, grupo: string, distanciaMaxima: number) {
        this.updateMostra(userKey);
        var objeto = this;
        var refOferta = firebase.database().ref("Ofertas/");
        var filtrarDataAux = objeto.filtrarData && (data != null);
        refOferta.once("value", function(snapshotOferta) {
            if (filtrarDataAux) {
                snapshotOferta.forEach(function(oferta) {
                    var data_oferta = oferta.val().Fim;
                    data_oferta = data_oferta.split("-");

                    var n1 = (parseInt(data[0]) * 10000) + (parseInt(data[1]) * 100) + (parseInt(data[2]));
                    var n2 = (parseInt(data_oferta[0]) * 10000) + (parseInt(data_oferta[1]) * 100) + (parseInt(data_oferta[2]));

                    if (n1 <= n2) {
                        if (!objeto.filtrarInt) {
                            objeto.mostrarOferta[oferta.key] = true;
                        }
                    }
                    else {
                        objeto.mostrarOferta[oferta.key] = false;
                    }
                })
            }

            if (objeto.filtrarGrupo) {
                snapshotOferta.forEach(function(oferta) {
                    if (grupo == oferta.val().Grupo) {
                        if (!objeto.filtrarInt && !filtrarDataAux) {
                            objeto.mostrarOferta[oferta.key] = true;
                        }
                    }
                    else {
                        objeto.mostrarOferta[oferta.key] = false;
                    }
                })
            }

            if (objeto.filtrarDistancia) {
                snapshotOferta.forEach(function(oferta) {
                    var refEstab = objeto.estabProvider.getRef(oferta.val().Estabelecimento);
                    refEstab.orderByChild("key").once("value").then(function(estabelecimento) {
                        if (estabelecimento.val()) {
                            var latitude = estabelecimento.val().latitude;
                            var longitude = estabelecimento.val().longitude;
                            var distancia = objeto.GPS.getDistancia(latitude, longitude);

                            if (distancia <= distanciaMaxima) {
                                if (!objeto.filtrarInt && !filtrarDataAux && !objeto.filtrarGrupo) {
                                    objeto.mostrarOferta[oferta.key] = true;
                                }
                            }
                            else {
                                objeto.mostrarOferta[oferta.key] = false;
                            }

                            if (objeto.mostrarOferta[oferta.key])
                                objeto.GPS.setEstabelecimentosAMostrar(estabelecimento.key, estabelecimento.val().nome, latitude, longitude);
                        }
                    });
                })
            }
        })
    }

    getAllRelevantes(userKey: string) {
        this.updateMostra(userKey);
        return this.db.list(this.PATH, ref => ref.orderByChild("Produto"))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({
                    key: c.payload.key,
                    mostrar: this.mostrarOferta[c.payload.key],
                    ...c.payload.val()
                }));
            })
    }

    getAll() {
        return this.db.list(this.PATH)
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }



    getAllEstab(estabKey: string) {
        return this.db.list(this.PATH, res => res
            .orderByChild("Estabelecimento")
            .equalTo(estabKey))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    get(key: string) {
        return this.db.object(this.PATH + key)
            .snapshotChanges()
            .map(c => {
                return { key: c.key, ...c.payload.val() };
            })
    }

    save(oferta: any, estabKey: string, produto: any) {
        console.log(estabKey);
        return new Promise((resolve, reject) => {
            if (oferta.key) { // Existe chave -> Atualizar
                this.db.list(this.PATH)
                    .update(oferta.key, {
                        Descricao: oferta.Descricao,
                        EstoqueInicial: oferta.EstoqueInicial,
                        Fim: oferta.Fim,
                        Inicio: oferta.Inicio,
                        Preco: oferta.Preco,
                        Produto: produto.nome,
                        Grupo: oferta.Grupo,
                        Estabelecimento: estabKey,
                        URL: oferta.URL,
                        ProdutoId: produto.key,
                        Status: oferta.Status,
                    })
                    .then(() => resolve())
                    .catch((e) => reject(e));

            } else { // Nao existe chave -> Inserir
                this.db.list(this.PATH)
                    .push({
                        Descricao: oferta.Descricao,
                        EstoqueInicial: oferta.EstoqueInicial,
                        Fim: oferta.Fim,
                        Inicio: oferta.Inicio,
                        Preco: oferta.Preco,
                        Produto: produto.nome,
                        Grupo: oferta.Grupo,
                        Estabelecimento: estabKey,
                        URL: oferta.URL,
                        ProdutoId: produto.key,
                        Status: oferta.Status, //Mudei essa linha
                    })
                    .then(() => resolve());
            }
        });
    }

    remove(key: string) {
        return this.db.list(this.PATH).remove(key);
    }


    URLInsert(URL, OfertaKey) {
        var TempURL = { 'URL': null }
        TempURL.URL = URL;
        this.db.object('Ofertas/' + OfertaKey).update(TempURL)
            .catch((error: any) => console.log(error));
    }




}
