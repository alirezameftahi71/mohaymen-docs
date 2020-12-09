import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {RepositoryListComponent} from './components/repository-list/repository-list.component';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {JumbotronComponent} from './components/jumbotron/jumbotron.component';
import {HomePageComponent} from './home-page/home-page.component';
import {FooterComponent} from './components/footer/footer.component';
import {DynamicBarComponent} from './components/dynamic-bar/dynamic-bar.component';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {TocComponent} from './components/toc/toc.component';
import {DocumentContentComponent} from './components/document-content/document-content.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TreeViewModule} from '@progress/kendo-angular-treeview';
import {FormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {VersionSelectComponent} from './components/version-select/version-select.component';
import {RTL} from '@progress/kendo-angular-l10n';
import {ActionBarComponent} from './components/action-bar/action-bar.component';
import {TimeToReadComponent} from './components/time-to-read/time-to-read.component';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RepositoryListComponent,
    DocsPageComponent,
    JumbotronComponent,
    HomePageComponent,
    FooterComponent,
    DynamicBarComponent,
    SideBarComponent,
    TocComponent,
    DocumentContentComponent,
    NotFoundPageComponent,
    VersionSelectComponent,
    ActionBarComponent,
    TimeToReadComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    TreeViewModule,
    FormsModule,
  ],
  providers: [
    {provide: RTL, useValue: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
