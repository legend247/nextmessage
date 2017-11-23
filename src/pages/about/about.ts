import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
              public apollo: Angular2Apollo) {

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
}
