import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, ModalController } from 'ionic-angular';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';
import { ImageProvider } from '../../providers/image/image';
import { Camera } from '@ionic-native/camera';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { OfertaProvider } from '../../providers/ofertas/ofertas';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import firebase from 'firebase';
/**
 * Generated class for the InserirOfertaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inserir-oferta',
    templateUrl: 'inserir-oferta.html',
})
export class InserirOfertaPage {

    public loadingController: LoadingController
    lastImage: string = null;
    loading: Loading;
    picture: any = null;
    imageData: any = null;

    IDImg: string = null;
    Oferta = {
        'key': '',
        'URL': '',
        'Produto': '',
        'Inicio': '',
        'Fim': '',
        'Preco': ' ',
        'EstoqueInicial': ' ',
        'Grupo': ' ',
        'Descricao': '',
        'Estabelecimento': '',
        'Status': '',
    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public dbService: FirebaseServiceProvider,
        public toastrService: ToastrServiceProvider,
        private imageSrv: ImageProvider,
        private camera: Camera,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public provOferta: OfertaProvider,
        public provProduto: ProdutosProvider,
        private modal: ModalController,
        private userMaintenance: UserMaintenance,
        public loadingCtrl: LoadingController,
    ) {
        this.provProduto.produtoAtual = undefined;
    }

    EscolherProduto() {
        const meus_produtos = this.modal.create("ModalProdutosPage", { continuar: 0, retornar: 1 })
        meus_produtos.present();
    }

    CheckDate(Date1: string, Date2: string): boolean {
        if ((Date1) != '' && (Date2) != '') {
            var dt1 = Date1.split("-");
            var dt2 = Date2.split("-");
            var i = Math.floor(Date.UTC(Number(dt2[0]), Number(dt2[1]), Number(dt2[2])) - Date.UTC(Number(dt1[0]), Number(dt1[1]), Number(dt1[2]))) / (1000 * 60 * 60 * 24);
            if (i < 0) {
                this.toastrService.ShowMSG('O período final não pode ser anterior ao inicial!', 3000).present();
                return false;
            }
            else if (i > 7) {
                this.toastrService.ShowMSG('A oferta não pode exceder 7 dias!', 3000).present();
                return false;
            }
            return true;
        }
        else {
            this.toastrService.ShowMSG('Insira o período da oferta!', 3000).present();
            return false;
        }
    }

    CheckPicture(picture): boolean {
        if (picture == null) {
            this.toastrService.ShowMSG('Selecione uma imagem!', 3000).present();
            return true; //Vou deixar true por enquanto pra testar
        }
        else {
            return true;
        }
    }

    async Inserir(Oferta) {

        var k1: boolean = this.CheckPicture(this.picture);
        var k0: boolean = this.CheckDate(Oferta.Inicio, Oferta.Fim);

        if (k1 && k0) {

            let loading = this.loadingCtrl.create({
                content: 'Fazendo upload... aguarde!'
            });
            loading.present();

            await this.uploadImage();
            this.Oferta.Status = 'Ativada'; //Faz com que a oferta seja ativada
            this.Oferta.key = this.imageSrv.ChaveOferta();

            this.provOferta.save(Oferta, this.userMaintenance
                .getUserKey(), this.provProduto.produtoAtual)
                .then(d => {
                    this.toastrService.ShowMSG('Oferta adicionada!', 3000).present();
                    loading.dismiss();
                    this.navCtrl.pop();
                    let storageRef = firebase
                        .storage().ref()
                        .child(`Ofertas/` + this.IDImg + `.jpg`)
                        .getDownloadURL()
                        .then((url) => { this.provOferta.URLInsert(url, this.Oferta.key); });
                });

        }

    }

    // Funções Imagem
    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Selecione a fonte da imagem.',
            buttons: [
                {
                    text: 'Galeria',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Câmera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
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

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        var d = new Date(),
            n = d.getTime() + s4() + '-' + s4(),
            newFileName = n;
        return newFileName;
    }

    private presentToast(text) {

        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    async uploadImage() {
        // Destination URL
        var name = this.createFileName();
        this.IDImg = name;
        await this.imageSrv.addPicture(this.IDImg, this.imageData, '/Ofertas/');
    }

}
