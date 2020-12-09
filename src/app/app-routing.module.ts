import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: '404', component: NotFoundPageComponent},
  {
    path: 'docs',
    children: [{path: '**', component: DocsPageComponent}]
  },
  {path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
