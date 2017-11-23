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
allData = {};

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

    this.apollo.query({
      query: gql`
      query conversationData($conversationId: ID!) {
        allConversations(filter: {id: $conversationId} ){
          id
          messages {
            id
          }
        }
      }
      `, variables: {
        conversationId: conversation.id
      }
    }).toPromise().then(({data})=>{
      this.allData = data;
      let messages = (this.allData as any).allConversations[0].messages;
      for(let message of messages){
        this.apollo.mutate({
          mutation: gql`
            mutation deleteMessages($messageId:ID!){
              deleteMessage(id:$messageId){
                id
              }
            }
          `, variables: {
            messageId: message.id,
          }
        }).subscribe(({data})=>{
          console.log("M: ",data);
        });
      }

      this.apollo.mutate({
        mutation: gql `
        mutation deleteConversation($conversationID: ID!){
          deleteConversation(id:$conversationID){
            id
          }
        }
        `, variables: {
          conversationID: conversation.id
        }
      }).subscribe(({data}) =>{
        console.log("C: ", data);
      });

    });

  }

}
