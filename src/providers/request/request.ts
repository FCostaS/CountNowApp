import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class RequestProvider {
    private PATH = 'requests/';

    constructor(private db: AngularFireDatabase) { }

    getAllDesc(request){
        return this.db.list(this.PATH + request.key + '/')
          .snapshotChanges()
          .map(changes => {
            return changes.map(c=> ({ key: c.payload.key, ...c.payload.val()}));
          })
    }

    getAll() {
        return this.db.list(this.PATH, ref => ref.orderByKey())
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

    save(request: any) {
        return new Promise((resolve, reject) => {
            if (request.key) { // Existe chave -> Atualizar
                this.db.list(this.PATH + request.produto + '/')
                    .update(request.key, {
                      descricao: request.descricao
                    })
                    .then(() => resolve())
                    .catch((e) => reject(e));

            } else { // Nao existe chave -> Inserir
                this.db.list(this.PATH + request.produto + '/')
                    .push({
                      descricao: request.descricao
                    })
                    .then(() => resolve());
            }
        });
    }

    removeProduto(produto: string) {
        return this.db.list(this.PATH).remove(produto);
    }

}
