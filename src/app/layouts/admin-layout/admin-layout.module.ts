import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LbdModule } from '../../lbd/lbd.module';
import { NguiMapModule} from '@ngui/map';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/user.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import {ChartModule} from "primeng/chart";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";

import {DayViewComponent} from "../../day-view/day-view.component";
import {MonthViewComponent} from "../../month-view/month-view.component";
import {YearViewComponent} from "../../year-view/year-view.component";

import {DayChartComponent} from "../../day-chart/day-chart.component";
import {MonthChartComponent} from "../../month-chart/month-chart.component";
import {YearChartComponent} from "../../year-chart/year-chart.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        LbdModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
        ChartModule,
        MatFormFieldModule,
        MatDatepickerModule,
        CalendarModule,
        CardModule,
        TableModule
    ],
  declarations: [
    HomeComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    NotificationsComponent,

    DayViewComponent,
    MonthViewComponent,
    YearViewComponent,

    DayChartComponent,
    MonthChartComponent,
    YearChartComponent
  ]
})

export class AdminLayoutModule {}
