import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Platform, AlertController, Alert } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
//import { ProdutosProvider } from '../../providers/produtos/produtos';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
//import { LocalNotifications } from 'ionic-native';

// For date/time
// import * as moment from 'moment';

@Injectable()
export class NotificationsProvider {

    isAndroid: boolean;
    ReceberNotificacoes: boolean;

    NotificationsList: string[] = ['Confira novas ofertas próxima à você',
                                   'Produtos que seu interesse estão disponíveis',
                                   'Ofertas de seu interesse estão disponíveis'];

    constructor(
      public platform: Platform,
      public alertCtrl: AlertController,
      private localNotifications: LocalNotifications,
      public user: UserMaintenance,
    ){
      this.isAndroid = true;
    }

    MessageNotification(messageIndex): string{
      return this.NotificationsList[messageIndex];
    }

    SendNotification(message){
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        text: message,
        sound: this.isAndroid? 'file://sound.mp3': 'file://beep.caf',
        //data: { secret: key }
      });
    }

    // Schedule multiple notifications
    MultNotification(message1,message2)
    {
        this.localNotifications.schedule([{
           id: 1,
           text: message1,
           sound: this.isAndroid ? 'file://sound.mp3': 'file://beep.caf',
           //data: { secret:key }
          },{
           id: 2,
           title: 'Local ILocalNotification Example',
           text: message2,
           icon: 'http://example.com/icon.png'
        }]);
    }


    // Schedule delayed notification
    DelayNotification()
    {
        this.localNotifications.schedule({
           text: 'Delayed ILocalNotification',
           trigger: {at: new Date(new Date().getTime() + 3600)},
           led: 'FF0000',
           sound: null
        });
    }


}
