import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import {environment} from "../environments/environment";

function initializeKeycloak(keycloak: KeycloakService) {
    return () => keycloak.init({
            config: {
                url: environment.FPPSS_KEYCLOAK_URL,
                realm: environment.FPPSS_KEYCLOAK_REALM,
                clientId: environment.FPPSS_KEYCLOAK_CLIENT_ID
            },
            initOptions: {
                onLoad: 'login-required',
                // this will solved  the firefox error error
                checkLoginIframe: false
                /*silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/verificar-sso.html'*/
            }
        });
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        AppRoutingModule,
        KeycloakAngularModule
    ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [{
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
  }],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
