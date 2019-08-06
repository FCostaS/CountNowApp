import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { InserirOfertaPage } from '../pages/inserir-oferta/inserir-oferta';
import { MapaPage } from '../pages/mapa/mapa';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { UserPageModule } from '../pages/user/user.module';

import { AuthService } from '../pages/core/auth.service';
import { UserService } from '../pages/core/user.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environment/environment';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { UserMaintenance } from '../providers/firebase-service/user_maintenance';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ToastrServiceProvider } from '../providers/toastr-service/toastr-service';
import { VerOfertasPageModule } from '../pages/ver-ofertas/ver-ofertas.module';
import { ProdutosPageModule } from '../pages/produtos/produtos.module';
import { TabsShopPage } from '../pages/tabs-shop/tabs-shop';
import { ViewofertaPage } from '../pages/viewoferta/viewoferta';
import { ViewofertaEstabelecimentoPage } from '../pages/viewoferta-estabelecimento/viewoferta-estabelecimento';
import { ProdutosInfoPageModule } from '../pages/produtos-info/produtos-info.module';
import { MinhasOfertasPageModule } from '../pages/minhas-ofertas/minhas-ofertas.module';
import { OfertaProvider } from '../providers/ofertas/ofertas';
import { ImageProvider } from '../providers/image/image';
import { ProdutosProvider } from '../providers/produtos/produtos';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import firebase from 'firebase';
import { EstabProvider } from '../providers/estabelecimentos/estabelecimentos';
import { ListarEstabPageModule } from '../pages/listar-estab/listar-estab.module';
import { DetalhesEstabPageModule } from '../pages/detalhes-estab/detalhes-estab.module';
import { ReviewProvider } from '../providers/reviews/reviews';
import { GiveReviewPageModule } from '../pages/give-review/give-review.module';
import { MostrarProdutosPageModule } from '../pages/mostrar-produtos/mostrar-produtos.module';
import { InserirSolitPageModule } from '../pages/inserir-solit/inserir-solit.module';
import { RequestProvider } from '../providers/request/request';
import { TabsAdminPage } from '../pages/tabs-admin/tabs-admin';
import { VerRequestsPage } from '../pages/ver-requests/ver-requests';
import { VerRequestsPageModule } from '../pages/ver-requests/ver-requests.module';
import { RelatarProblemaProvider } from '../providers/relatar-problema/relatar-problema';
import { RelatarProblemasPage } from '../pages/relatar-problemas/relatar-problemas';
import { ProblemasRelatadosPage } from '../pages/problemas-relatados/problemas-relatados';
import { ImagensEstabPageModule } from '../pages/imagens-estab/imagens-estab.module';
import { EstabImagemProvider } from '../providers/estabimagens/estabimagens';

// Geolocalização
import { Geolocation } from '@ionic-native/geolocation';
import { GpsProvider } from '../providers/gps/gps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { LocalNotifications } from '@ionic-native/local-notifications';



@NgModule({
    //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        TabsShopPage,
        TabsAdminPage,
        InserirOfertaPage,
        ViewofertaPage,
        MapaPage,
        ViewofertaEstabelecimentoPage,
        RelatarProblemasPage,
        ProblemasRelatadosPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        LoginPageModule,
        RegisterPageModule,
        UserPageModule,
        ListarEstabPageModule,
        VerOfertasPageModule,
        ProdutosPageModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ProdutosInfoPageModule,
        MinhasOfertasPageModule,
        DetalhesEstabPageModule,
        AngularFireDatabaseModule,
        GiveReviewPageModule,
        MostrarProdutosPageModule,
        InserirSolitPageModule,
        VerRequestsPageModule,
        ImagensEstabPageModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        TabsShopPage,
        TabsAdminPage,
        InserirOfertaPage,
        ViewofertaPage,
        MapaPage,
        ViewofertaEstabelecimentoPage,
        VerRequestsPage,
        RelatarProblemasPage,
        ProblemasRelatadosPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Facebook,
        GooglePlus,
        AuthService,
        UserService,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        FirebaseServiceProvider,
        ToastrServiceProvider,
        UserMaintenance,
        OfertaProvider,
        ReviewProvider,
        ImageProvider,
        ProdutosProvider,
        EstabProvider,
        File,
        Transfer,
        Camera,
        FilePath,
        ProdutosProvider,
        Geolocation,
        NativeGeocoder,
        GpsProvider,
        GoogleMaps,
        RequestProvider,
        NotificationsProvider,
        LocalNotifications,
        RelatarProblemaProvider,
        EstabImagemProvider,
    ]
})
export class AppModule { }
