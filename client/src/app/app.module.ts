import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './component/app/app.component';
import {LandscapeDisplayComponent} from './component/landscape-display/landscape-display.component';

@NgModule({
  declarations: [
    AppComponent,
    LandscapeDisplayComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
