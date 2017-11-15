import { Component,Injectable } from '@angular/core';
import { NavController, NavParams, Content} from 'ionic-angular';
import {Http, Headers, Response} from '@angular/http';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  conversation = {};
  conversationId = this.navParams.get("conversation");
  lastMessage = <any> [];
  lastMessageText = "";
  userId = this.navParams.get("userId");
  newMessage ="";

  // @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apollo: Angular2Apollo) {
  }

    sendMsg(){
        this.apollo.mutate({
          mutation: gql`
          mutation createMessage($text:String!,$userId: ID!, $conversationId: ID!){
            createMessage(text:$text, userId:$userId, conversationId:$conversationId){
              id
            }
          }
          `,
          variables: {
            text: this.newMessage,
            userId: this.userId,
            conversationId: this.conversationId
          }
        }).toPromise();
        this.lastMessageText=this.newMessage;
        this.newMessage = "";
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Chat');
    this.apollo.watchQuery({
      query: gql`
        query($conversationId:ID!) {
        	Conversation(id:$conversationId){
            messages(last: 1) {
              id
              text
            }
          }
        }
      `, variables: {
        conversationId: this.navParams.get("conversation")
      },
      pollInterval: 10000,
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      console.log("CHAT DATA: ",data);
      this.lastMessage = data;
      this.lastMessage = this.lastMessage.Conversation.messages;
      this.lastMessageText = this.lastMessage[0]!= undefined ? this.lastMessage[0].text : "Send the first message!" ;
    });
  }

}
