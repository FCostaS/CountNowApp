import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class ImageProvider {
    fireAuth: any;
    picture: any = null;

    constructor(
        public afDatabase: AngularFireDatabase,
        public afAuth: AngularFireAuth, ) {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.fireAuth = user;
            }
        });
    }

    getUser(): firebase.User { return this.fireAuth; }

    async addPicture(pictureName, picture, DirectoryImage) {
        if (picture != null) {
            await firebase.storage()
                          .ref(DirectoryImage)
                          .child(pictureName + '.jpg')
                          .putString(picture, 'base64', { contentType: 'image/jpeg' });
            /// Mensagem do bem
        }
        else {
            /// Mensagem do mal
        }
        return (DirectoryImage + pictureName);
    }

    getImage(Paste: string, URL: string){
        var urll;
        let storageRef = firebase.storage().ref()
                                 .child(`${Paste}/${URL}`)
                                 .getDownloadURL().then((url) => { urll = url; });
        return urll;
    }

    public downloadImageUrls(Paste: string, URL: string): any {
      let storageRef = firebase.storage().ref()
                              .child(`${Paste}/${URL}`)
                              .getDownloadURL().then((url) => { this.picture = url; });
          return this.picture;
    }

    ChaveOferta():string{
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}
