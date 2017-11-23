import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chat } from '../chat/chat';
import { NewChatPage } from '../new-chat/new-chat';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

allConversations = <any>[];
conversations = <any>[];
userId = window.localStorage.getItem('userID');

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo) {
  }

  ionViewDidLoad(){
    this.apollo.watchQuery({
      query: gql`
        query {
          allConversations {
            id
            users {
              id
              userName
            }
          }
        }
      `,
      pollInterval: 10000,
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      console.log("HOME DATA: ",data);
      this.allConversations = data;
      this.conversations = this.allConversations.allConversations;
    });
  }

  newChat(){
    this.navCtrl.push(NewChatPage);
  }

  navChat(conversation) {
    console.log("BEFORE CHAT: ", conversation);
    this.navCtrl.push(Chat, {conversation : conversation.id})
  }

  deleteConversation(conversation){
    // console.log(conversation);
      this.apollo.mutate({
        mutation: gql`
        mutation deleteConversation($conversationID: ID!){
        	deleteConversation(id:$conversationID){
            id
          }
        }
        `,variables:{
          conversationID: conversation.id
        }
      }).subscribe(({data})=>{
        let index = allConversations.indexOf( x => conversation.id == x.id);
        console.log(index);
        if(index > -1){
          allConversations.splice(index,1);
        }
      });
  }

}
