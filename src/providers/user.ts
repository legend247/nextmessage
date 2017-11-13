import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


export class User {

  ID = window.localStorage.getItem("userID");


  constructor(public apollo: Angular2Apollo){}

  info(){
    console.log(this.ID);
    // this.apollo.query(){
    //   query: gql`
    //     User{
    //       id
    //     }
    //   `
    }
  }
