import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
declare var google;

@Injectable()
export class GpsProvider {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    originPosition: any;
    destinationPosition: any;
    map: any;
    initMap: boolean = false;
    estabAcess: boolean = false;
    estabelecimentosAMostrar: {[key:string] : any} = {};

    public Localizacao = {
        'latitude': null,
        'longitude': null,
        'acuracia': null,
    }

    constructor(
        private geolocation: Geolocation,
        private platform: Platform,
        private nativeGeocoder: NativeGeocoder,
    ) {}

    async getLocalizacao() {
      try{
        await this.platform.ready();
        var res = await this.geolocation.getCurrentPosition();
        this.Localizacao.latitude = res.coords.latitude;
        this.Localizacao.longitude = res.coords.longitude;
        this.Localizacao.acuracia = res.coords.accuracy;
      }catch(err){
        alert("Erro ao obter localização");
      }

    }

    async getLocalizacaoPorEndereco(Endereco) {
        await this.nativeGeocoder.forwardGeocode(Endereco)
            .then((coordinates: NativeGeocoderForwardResult[]) => {
                this.Localizacao.latitude = coordinates[0].latitude;
                this.Localizacao.longitude = coordinates[0].longitude;
            })
            .catch((error: any) => console.log(error));
    }

    getDistancia(latitudeEstabelecimento, longitudeEstabelecimento) {//retorna em km


        var R = 6371e3; // metres
        latitudeEstabelecimento = latitudeEstabelecimento * 0.0174533; // converte para radianos
        var latitudeCliente = this.Localizacao.latitude * 0.0174533;

        var deltaLatitude = (latitudeEstabelecimento - latitudeCliente);

        longitudeEstabelecimento = longitudeEstabelecimento * 0.0174533;
        var longitudeCliente = this.Localizacao.longitude * 0.0174533;

        var deltaLongitude = (longitudeEstabelecimento - longitudeCliente);

        var a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.cos(deltaLatitude) * Math.cos(deltaLatitude) *
            Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = Math.round((R * c) / 1000);

        return d;
    }

    // Funções para o Google
    calculateRoute(originPosition,destinationPosition) {
        if (destinationPosition && originPosition) {
          const request = {
            // Pode ser uma coordenada (LatLng), uma string ou um lugar
            origin: originPosition,
            destination: destinationPosition,
            travelMode: 'DRIVING'
          };

          this.traceRoute(this.directionsService, this.directionsDisplay, request);
        }
      }

    async traceRoute(service: any, display: any, request: any) {
      await service.route(request, function (result, status) {
        if (status == 'OK') {
          display.setDirections(result);
        }
      });
    }

    async delay(ms: number) {
    return await new Promise( resolve => setTimeout(resolve, ms) );
    }

    atualizarMapa(){
      var estabelecimento;
      console.log(this.estabelecimentosAMostrar);
      for(let key in this.estabelecimentosAMostrar){
        estabelecimento = this.estabelecimentosAMostrar[key];
        this.addMarker(estabelecimento["latitude"], estabelecimento["longitude"], estabelecimento["nome"]);
      }
    }

    async StartMap() {

      this.getLocalizacao();
      this.originPosition = new google.maps.LatLng(this.Localizacao.latitude,  this.Localizacao.longitude);

      const mapOptions = {
        zoom: 18,
        center: this.originPosition,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      await this.directionsDisplay.setMap(this.map);

      const marker = new google.maps.Marker({
        position: this.originPosition,
        map: this.map,
      });

      if(!this.initMap)
      {
          this.initMap = true;
          this.calculateRoute(this.originPosition,this.destinationPosition);
      }

      this.atualizarMapa();
    }

    setEstabelecimentosAMostrar(keyEstabelecimento, nome, latitude, longitude){
        this.estabelecimentosAMostrar[keyEstabelecimento] = {};
        this.estabelecimentosAMostrar[keyEstabelecimento] = {"nome" : nome, "latitude" : latitude, "longitude" : longitude};
    }

    addMarker(lat,long,nameLocal) {
        var position = new google.maps.LatLng(lat,long);
        var dogwalkMarker = new google.maps.Marker({position: position, title: nameLocal});
        dogwalkMarker.setMap(this.map);
    }

}
