import { Component } from '@angular/core';

//import { AboutPage } from '../about/about';
//import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { VerOfertasPage } from '../ver-ofertas/ver-ofertas';
//import { ProdutosPage } from '../produtos/produtos';
import { ListarEstabPage } from '../listar-estab/listar-estab';
import { MostrarProdutosPage } from '../mostrar-produtos/mostrar-produtos';
import { MapaPage } from '../mapa/mapa';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    MapaRoot = MapaPage;
    homeRoot = HomePage;
    produtoRoot = MostrarProdutosPage;
    ofertasRoot = VerOfertasPage;
    userRoot = UserPage;
    estabRoot = ListarEstabPage;

    constructor() {
    }
}
