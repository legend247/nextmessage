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
  allUsers = <any>[];
  queryList = <any>[];
  USER = <any>{};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apollo: Angular2Apollo) {
  }

    ngOnInit() {
      this.allUserInfo().then(({data}) => {
        let temp = <any>[];
        temp = data;
        this.USER = temp.user; // User object has id's and array of conversations
        this.allUsers = temp;
        this.allUsers = this.allUsers.allUsers;
      });
    }

    //Gets user info using graphcool token for authentication
    allUserInfo(){
        return this.apollo.query({
          query: gql`
          query{
            user{
              id
              conversations{
                id
                users{
                  id
                  userName
                }
              }
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

    this.queryList = this.queryList.filter((v) => {
      if(v.userName && q) {
        if (v.userName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          // console.log(v);
          if(v.id  == this.USER.id){
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
    console.log(user);
    let status = this.conversationExists(user);

    if(status !=null){
      //navigate to that conversation
      console.log("Navigate to conversation");
      this.navCtrl.pop().then( ()=> {
        this.navCtrl.push(Chat, {conversation : status.id })
      });

    } else{
      // Create conversation
      this.createConversation(user);
    }
  }
    /*
     * Return Bool, checks if that user conversation exists.
     */
    conversationExists(user) {
      for( let conversation of this.USER.conversations){
        for( let u of conversation.users){
          if(user.id === u.id){
            console.log("conversation exists!");
            return conversation;
          }
        }
      }
      console.log("conversation does not exist");
      return null;
    }

    /*
     * Return: void, Creates a conversation in the database
     */
    createConversation(user){
      this.apollo.mutate({
        mutation: gql`
        mutation createConversation($fromUser: ID!, $toUser:ID!){
        	createConversation(usersIds: [$fromUser,$toUser]){
            id
          }
        }
        `, variables: {
          fromUser: this.USER.id,
          toUser: user.id
        }
      }).toPromise().then(({data})=>{
        console.log(data)
        let temp = <any>{};
        temp = data;
        this.navCtrl.pop().then( () => this.navCtrl.push(Chat, {conversation : temp.createConversation.id}))
      });
    }

  onCancel(e){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewChatPage');
  }

}
