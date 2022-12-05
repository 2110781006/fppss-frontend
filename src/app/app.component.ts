import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakRoles } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public isLogueado = false;
    public perfilUsuario: KeycloakProfile | null = null;

     constructor(public location: Location, private readonly keycloak: KeycloakService) {}

    public async ngOnInit(){
        this.isLogueado = await this.keycloak.isLoggedIn();


        type rolesUsuarios = Array<{id: number, text: string}>;

        if (this.isLogueado) {
            this.perfilUsuario = await this.keycloak.loadUserProfile();
        }//console.log(this.perfilUsuario);
    }

    public loginSession() {
        this.keycloak.login()
    }

    public logoutSession() {

        this.keycloak.logout(window.location.origin);

    }

    isMap(path){
      var title = this.location.prepareExternalUrl(this.location.path());
      title = title.slice( 1 );
      if(path == title){
        return false;
      }
      else {
        return true;
      }
    }
}
