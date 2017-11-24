import { Component } from '@angular/core';
import { NavController, LoadingController, App } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  data = <any>{};
  username = "";

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public loadingCtrl: LoadingController,
              public app: App
            ) {

  }
  ngOnInit(){
      return this.apollo.query({
        query: gql`
        query{
          user{
            id
            userName
          }
        }
        `
      }).toPromise().then(({data}) => {
          this.data = data;
          this.username = this.data.user.userName;
      });
  }

  logoutUser() {
     window.localStorage.removeItem('graphcoolToken');
     this.loading = this.loadingCtrl.create({
       dismissOnPageChange: true,
       content: 'Logging Out...'
     });
     this.loading.present();
     this.navCtrl = this.app.getActiveNavs()
     this.navCtrl[0].setRoot(LoginPage);
     // console.log(this.app);
     // this.navCtrl.setRoot(LoginPage);
      // this.app.getRootNav().setRoot(LoginPage);
 }
}
