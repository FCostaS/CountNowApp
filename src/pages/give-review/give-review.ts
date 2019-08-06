import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EstabProvider } from '../../providers/estabelecimentos/estabelecimentos';
import { ReviewProvider } from '../../providers/reviews/reviews';
import { UserMaintenance } from '../../providers/firebase-service/user_maintenance';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
//
@NgModule({})
@IonicPage()
@Component({
    selector: 'page-give-review',
    templateUrl: 'give-review.html',
})
export class GiveReviewPage {

    reviewForm: FormGroup;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public provEstab: EstabProvider,
        public provReview: ReviewProvider,
        public provUser: UserMaintenance,
        public formBuilder: FormBuilder
    ) {
        this.reviewForm = this.formBuilder.group({
            nota: new FormControl(),
            comment: new FormControl(),
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GiveReviewPage');
    }

    saveReview(resultForm) {
      var estabKey = this.provEstab.EstabAtual.key;
      var userKey = this.provUser.getUserKey();
        this.provReview.save
            ({ nota: Number(resultForm.nota), comment: resultForm.comment },
            this.provEstab.EstabAtual.key,
            this.provUser.getUserKey(),
        );
        this.navCtrl.pop();
    }

}
