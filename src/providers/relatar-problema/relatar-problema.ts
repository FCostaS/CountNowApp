import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the RelatarProblemaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RelatarProblemaProvider {

  private dbRef;
  private PATH = 'problemas_relatados/';

  constructor(public db: AngularFireDatabase) {
      this.dbRef = this.db.list('problemas_relatados');
  }

  getAll() {
      return this.db.list(this.PATH, ref => ref.orderByKey())
          .snapshotChanges()
          .map(changes => {
              return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
          })
  }

  inserir(relato: any) {
      return this.dbRef.push(relato);
  }

  update(relato) {
      return this.dbRef
          .update(relato.key, relato);
  }

  remove(relato) {
      return this.dbRef
          .remove(relato.key);
  }

}
