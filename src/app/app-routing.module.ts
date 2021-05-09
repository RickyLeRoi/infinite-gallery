import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactScrollerComponent } from './components/fact-scroller/fact-scroller.component';
import { AppComponent } from './components/main/app.component';
import { TakeCareComponent } from './components/take-care/take-care.component';
import { ZoomComponent } from './components/zoom/zoom.component';

const routes: Routes = [ 
  {path:"", component: FactScrollerComponent},
  {path:"care", component: TakeCareComponent},
  {path:"zoom/:id", component: ZoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
