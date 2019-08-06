import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { EstabProvider } from '../estabelecimentos/estabelecimentos';
import { UserMaintenance } from '../firebase-service/user_maintenance';

@Injectable()
export class ReviewProvider {
    private PATH = 'Reviews/';
    public ReviewAtual = null;
    constructor(private db: AngularFireDatabase,
                public provEstab: EstabProvider,
                public provUser: UserMaintenance){
                }

    getAll(estabKey: string) {
        return this.db.list(this.PATH + estabKey + '/')
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    getAll_defined(estabKey: string) {
        return this.db.list(this.PATH + estabKey + '/', ref=>ref.orderByChild('Comment').startAt(""))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    get(key: string) {
        return this.db.object(key)
            .snapshotChanges()
            .map(c => {
                return { key: c.key, ...c.payload.val() };
            })
    }

    existeReview(estabKey: string, userKey: string){
        var ref = firebase.database().ref("Reviews/"+estabKey+"/"+userKey);
        var existeReview;
        return ref.once("value")
          //.then(function(snapshot){
          //  console.log(snapshot.exists());
          //  return (snapshot.exists());
          //})
        //return existeReview;
    }


    save(review: any, estabKey: string, userKey: string) {
      var that = this; //pqp
      var ref = firebase.database().ref("Reviews/"+estabKey+"/"+userKey);
      var reviewPath = this.PATH + estabKey + '/' + userKey + '/';
      return ref.once("value").then(function(snapshot){
        return new Promise((resolve, reject) => {
            if (snapshot.exists()) { // Existe chave -> Atualizar
                that.provUser.atualizarMedia(estabKey,review.nota,snapshot.val().Nota);
                that.db.object(reviewPath)
                    .update({
                        Nota: review.nota,
                        Comment: review.comment,
                    })
                    .then(() => resolve())
                    .catch((e) => reject(e));

            } else { // Nao existe chave -> Inserir
                that.provUser.incrementarMedia(estabKey,review.nota);
                that.db.object(reviewPath)
                    .update({
                        Nota: review.nota,
                        Comment: review.comment,
                    })
                    .then(() => resolve());
            }
        });
        });
    }

    remove(key: string) {
        return this.db.list(this.PATH).remove(key);
    }

    calcMedia(keyEstab: string){
      var ref = firebase.database().ref('Reviews/'+keyEstab+'/');
      var media
      return ref.once("value");
    }

}
