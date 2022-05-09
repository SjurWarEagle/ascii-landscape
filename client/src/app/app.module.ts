import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './component/app/app.component';
import {LandscapeDisplayComponent} from './component/landscape-display/landscape-display.component';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {AppRoutingModule} from "./app-routing.module";
import {LandscapeOverviewComponent} from "./component/landscape-overview/landscape-overview.component";
import {MeadowDisplayComponent} from "./component/maedow-display/meadow-display.component";
import {MeadowOverviewComponent} from "./component/maedow-overview/meadow-overview.component";

@NgModule({
  declarations: [
    AppComponent,
    LandscapeDisplayComponent,
    LandscapeOverviewComponent,
    MeadowDisplayComponent,
    MeadowOverviewComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
