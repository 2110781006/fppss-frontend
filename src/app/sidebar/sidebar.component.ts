import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    img: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/day-view', title: 'Tagesansicht',  icon: 'pe-7s-graph2', class: '', img: '/assets/img/calendar-hour.png' },
    { path: '/month-view', title: 'Monatsansicht',  icon: 'pe-7s-graph2', class: '', img: '/assets/img/calendar-month.png' },
    { path: '/year-view', title: 'Jahresansicht',  icon: 'pe-7s-graph2', class: '', img: '/assets/img/calendar-year.png' },
    { path: '/full-view', title: 'Gesamtansicht',  icon: 'pe-7s-graph2', class: '', img: '/assets/img/calendar-all.png' }
    /*{ path: '/user', title: 'User Profile',  icon:'pe-7s-user', class: '' }
    { path: '/table', title: 'Table List',  icon:'pe-7s-note2', class: '' },
    { path: '/typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    { path: '/icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    { path: '/maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' }*/
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private appComponent:AppComponent) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

    onLogout()
    {
        this.appComponent.logoutSession();
    }
}
