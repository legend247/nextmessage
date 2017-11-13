import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Chat } from '../chat/chat';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-new-chat',
  templateUrl: 'new-chat.html',
})
export class NewChatPage {
  userSearch = "";
  users = <any>[];
  userId = "";
  allUsers = <any>[];
  queryList = <any>[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apollo: Angular2Apollo) {
  }


    ngOnInit() {
      this.allUserInfo().then(({data}) => {
        this.userId = data.user.id;
        this.allUsers = data;
        // this.userId = this.allSections.user.id;
        this.allUsers = this.allUsers.allUsers;
        // this.allSections.sort(this.compare);
        console.log("ON INIT USER INFO: ", this.allUsers);
      });
    }

    //Gets user info using graphcool token for authentication
    allUserInfo(){
        return this.apollo.query({
          query: gql`
          query{
            user{
              id
            }
            allUsers(orderBy: userName_ASC){
              id
              userName
            }
          }
          `
        }).toPromise();
      }

  initializeItems(): void {
    this.queryList = this.allUsers;
    console.log(this.queryList);
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.target.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.queryList = [];
      return;
    }
    console.log("MY USER ID", this.userId);

    this.queryList = this.queryList.filter((v) => {
      if(v.userName && q) {
        if (v.userName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          // console.log(v);
          if(v.id  == this.userId){
            console.log("This is you: ",v);
          } else {
            console.log("This is not you: ", v);
            return v;
          }
        }
      }
    });

    console.log(q);
  }

  startConversation(user){
    console.log("USER DATA", user);
    this.apollo.mutate({
      mutation: gql`
      mutation createConversation($fromUser: ID!, $toUser:ID!){
      	createConversation(usersIds: [$fromUser,$toUser]){
          id
        }
      }
      `, variables: {
        fromUser: window.localStorage.getItem("userID"),
        toUser: user.id
      }
    }).toPromise().then(({data})=>{
      console.log(data)
      this.navCtrl.pop().then(this.navCtrl.push(Chat, {conversation : data.createConversation.id, userId: user.id }))
    })

  }

  onCancel(e){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewChatPage');
  }

}
