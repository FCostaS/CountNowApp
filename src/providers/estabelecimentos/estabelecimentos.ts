import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { ImageProvider } from '../../providers/image/image';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, ModalController } from 'ionic-angular';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';

@Injectable()
export class EstabProvider {
    private PATH = 'usuarios/estabelecimento/';
    public EstabAtual = null;
    public EstabMedia = 0;

    // Variáveis Imagem
    public loadingController: LoadingController
    lastImage: string = null;
    loading: Loading;
    picture: any = null;
    imageData: any = null;
    IDImg: string = null;

    constructor(private db: AngularFireDatabase,
                public imageSrv: ImageProvider,
                private camera: Camera,
                public toastrService: ToastrServiceProvider,
                public toastCtrl: ToastController,
              ) { }

    getAll() {
        return this.db.list(this.PATH, ref => ref.orderByChild("nome"))
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
    }

    getAllCalculoDistancia() {
        return this.db.list(this.PATH)
            .snapshotChanges();
    }

    get(key: string) {
        return this.db.object(this.PATH + key)
            .snapshotChanges()
            .map(c => {
                return { key: c.key, ...c.payload.val() };
            })
    }

    save(estab: any) {
        return new Promise((resolve, reject) => {
            if (estab.key) { // Existe chave -> Atualizar
                this.db.list(this.PATH)
                    .update(estab.key, {
                        Nome: estab.Descricao,
                        CNPJ: estab.EstoqueInicial,
                        Categoria: estab.Fim,
                        Estado: estab.Inicio,
                        Cidade: estab.Preco,
                        Endereco: estab.Produto,
                        Latitude: estab.Latitude,
                        Longitude: estab.Longitude,
                    })
                    .then(() => resolve())
                    .catch((e) => reject(e));

            } else { // Nao existe chave -> Inserir
                this.db.list(this.PATH)
                    .push({
                        Nome: estab.Descricao,
                        CNPJ: estab.EstoqueInicial,
                        Categoria: estab.Fim,
                        Estado: estab.Inicio,
                        Cidade: estab.Preco,
                        Endereco: estab.Produtos,
                        Latitude: estab.Latitude,
                        Longitude: estab.Longitude,
                    })
                    .then(() => resolve());
            }
        });
    }

    getRef(key: string){
      return firebase.database().ref(this.PATH + "/" + key);
    }

    remove(key: string) {
        return this.db.list(this.PATH).remove(key);
    }

    // Tratamento de imagens do Estabelecimento
    GalleryImg(){
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    async takePicture(sourceType) {
        await this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then(imageData => {

            this.picture = "data:image/jpeg;base64," + imageData;
            this.imageData = imageData;

        }, error => {
            this.presentToast('Erro ao selecionar a imagem.');
        });
    }

    private createFileName() {
        function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
        var d = new Date(),
            n = d.getTime() + s4() + '-' + s4(),
            newFileName = n;
        return newFileName;}

    async uploadImage() {
        // Destination URL
        var name = this.createFileName();
        this.IDImg = name;
        await this.imageSrv.addPicture(name, this.imageData, '/Estabelecimentos/');
    }

    URL(URL, Key) {
        var TempURL = { 'URL': null }
        TempURL.URL = URL;
        this.db.object('usuarios/estabelecimento/' + Key).update(TempURL)
            .catch((error: any) => console.log(error));
    }

    LinkDatabaseURL() {
      let storageRef = firebase
          .storage().ref()
          .child(`usuarios/estabelecimento/` + this.IDImg + `.jpg`)
          .getDownloadURL()
          .then((url) => { this.URL(url, this.EstabAtual); });
    }

}
