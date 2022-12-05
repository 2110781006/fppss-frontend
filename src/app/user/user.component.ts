import { Component, OnInit } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  username : string;
  email : string;
  firstname : string;
  surename : string;
  address : string;
  city : string;
  country : string;
  zip : string;

  constructor(private readonly keycloak: KeycloakService) { }

  async ngOnInit() {

    let userprofile: KeycloakProfile;
    userprofile = await this.keycloak.loadUserProfile();
console.log(userprofile);
    this.username = userprofile.username;
    this.email = userprofile.email;
    this.firstname = userprofile.firstName;
    this.surename = userprofile.lastName;

    this.address = userprofile['attributes']['address'];
    this.city = userprofile['attributes']['city'];
    this.country = userprofile['attributes']['country'];
    this.zip = userprofile['attributes']['zip'];
    //this.address = this.keycloak.getKeycloakInstance().loadUserInfo();
      console.log(userprofile['attributes']);

  }

}
