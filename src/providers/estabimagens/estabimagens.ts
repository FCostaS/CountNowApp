import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { EstabProvider } from '../estabelecimentos/estabelecimentos';
import { UserMaintenance } from '../firebase-service/user_maintenance';

@Injectable()
export class EstabImagemProvider {
    private PATH = 'EstabImagem/';
    public ReviewAtual = null;
    constructor(private db: AngularFireDatabase,
                public provEstab: EstabProvider,
                public provUser: UserMaintenance){
                }

    getAll() {
        return this.db.list(this.PATH)
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    getAllEstab(estabKey: string) {
        return this.db.list(this.PATH, res=>res
          .orderByChild("Estab")
          .equalTo(estabKey))
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

    save(link: string, estabKey: string) {
        console.log(estabKey);
        this.provUser.inrementarNumImagens(estabKey);
        return new Promise((resolve, reject) => {
                this.db.list(this.PATH)
                    .push({
                      img: link,
                      Estab: estabKey,
                    })
                    .then(() => resolve());

        });
    }
    remove(imgKey: string, estabKey: string) {
        this.provUser.decrementarNumImagens(estabKey);
        return this.db.list(this.PATH).remove(imgKey);
    }

}
