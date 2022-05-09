import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandscapeOverviewComponent} from "./component/landscape-overview/landscape-overview.component";
import {MeadowOverviewComponent} from "./component/maedow-overview/meadow-overview.component";

const routes: Routes = [
  {path: '', redirectTo: 'landscape', pathMatch: 'full'},
  {path: 'maedow', component: MeadowOverviewComponent},
  {path: 'flower', redirectTo: 'maedow', pathMatch: 'full'},
  {path: 'maedows', redirectTo: 'maedow', pathMatch: 'full'},
  {path: 'flowers', redirectTo: 'maedow', pathMatch: 'full'},
  {path: 'land', redirectTo: 'landscape', pathMatch: 'full'},
  {path: 'landscape', component: LandscapeOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
