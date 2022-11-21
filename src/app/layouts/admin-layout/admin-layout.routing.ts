import { Routes } from '@angular/router';

import { YearViewComponent } from '../../year-view/year-view.component';
import { DayViewComponent } from '../../day-view/day-view.component';
import { MonthViewComponent } from '../../month-view/month-view.component';
import { FullViewComponent } from '../../full-view/full-view.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'day-view',       component: DayViewComponent },
    { path: 'month-view',     component: MonthViewComponent },
    { path: 'year-view',      component: YearViewComponent },
    { path: 'full-view',      component: FullViewComponent }
/*    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TablesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent }*/
];
