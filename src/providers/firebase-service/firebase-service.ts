//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseServiceProvider {
    private dbRef;

    constructor(public db: AngularFireDatabase) {
        this.dbRef = this.db.list('Ofertas');
    }

    getAll() {
        return this.dbRef.snapshotChanges().map(data => {
            return data.map(d => ({ key: d.key, ...d.payload.val() }));
        });
    }

    Inserir(Oferta: any) {
        return this.dbRef.push(Oferta);
    }

    update(Oferta) {
        return this.dbRef
            .update(Oferta.key, Oferta);
    }

    remove(Oferta) {
        return this.dbRef
            .remove(Oferta.key);
    }

}
