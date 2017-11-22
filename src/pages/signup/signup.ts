import { Component } from '@angular/core';
import { NavController, ToastController, Platform} from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  questions = <any>[];

  fullName: "";
  userName: "";
  email: "";
  password: "";
  confirmPassword: "";
  userInfo = <any>{};

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public toastCtrl: ToastController,
              private platform: Platform ) {

  }

  loginEvent(event) {
    if (!this.fullName || !this.userName || !this.email || !this.password || !this.confirmPassword) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else if(this.password != this.confirmPassword){
      let toast = this.toastCtrl.create({
        message: 'Your passwords do not match. Please try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else{
      this.createUser().then(({data}) => {
          if (data){
            this.signIn().then(({data}) => {
              this.userInfo.data = data
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.setRoot(TabsPage);
            }, (errors) => {
                console.log(errors);
                if (errors == "GraphQL error: No user found with that information") {
                  let toast = this.toastCtrl.create({
                    message: 'User already exists with that information. Try again.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                }
              });

          }
        }, (errors) => {
          console.log(errors);
          if (errors == "Error: GraphQL error: User already exists with that information") {
            let toast = this.toastCtrl.create({
              message: 'User already exists with that information. Try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
    }
  }


  createUser(){
      console.log(this.fullName);
      return this.apollo.mutate({
        mutation: gql`
          mutation createUser($email: String!,
                              $password: String!,
                              $fullName: String!,
                              $userName: String!){

            createUser(authProvider: { email: {email: $email, password: $password}},
                       fullName: $fullName,
                       userName: $userName){
              id
            }
          }
        `,
        variables: {
          fullName: this.fullName,
          userName: this.userName,
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

  signIn(){
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,
                            $password: String!){

          signinUser(email: {email: $email, password: $password}){
            token
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

}
