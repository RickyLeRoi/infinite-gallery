import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './components/main/app.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FactScrollerComponent } from './components/fact-scroller/fact-scroller.component';
import { TakeCareComponent } from './components/take-care/take-care.component';
import { GhostComponent } from './components/ghost/ghost.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ZoomComponent } from './components/zoom/zoom.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCarouselModule } from '@ngmodule/material-carousel';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    FactScrollerComponent,
    TakeCareComponent,
    GhostComponent,
    LoadingComponent,
    ZoomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCarouselModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
