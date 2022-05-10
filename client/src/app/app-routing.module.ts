import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandscapeOverviewComponent} from "./component/landscape-overview/landscape-overview.component";
import {MeadowOverviewComponent} from "./component/maedow-overview/meadow-overview.component";

const routes: Routes = [
  {path: '', redirectTo: 'landscape', pathMatch: 'full'},
  {path: 'maedow', component: MeadowOverviewComponent},
  {path: 'wiese', redirectTo: 'meadow', pathMatch: 'full'},
  {path: 'flower', redirectTo: 'meadow', pathMatch: 'full'},
  {path: 'meadows', redirectTo: 'meadow', pathMatch: 'full'},
  {path: 'flowers', redirectTo: 'meadow', pathMatch: 'full'},
  {path: 'land', redirectTo: 'landscape', pathMatch: 'full'},
  {path: 'landscape', component: LandscapeOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
