import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EsriLoaderService } from 'angular2-esri-loader';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { SearchComponent } from './search/search.component';
import { LayerControlComponent } from './layer-control/layer-control.component';
import { QueryGridComponent } from './query-grid/query-grid.component';
import { PrintComponent } from './print/print.component';
import { BasemapComponent } from './basemap/basemap.component';
import { BookmarkComponent } from './bookmark/bookmark.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    SearchComponent,
    LayerControlComponent,
    QueryGridComponent,
    PrintComponent,
    BasemapComponent,
    BookmarkComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [EsriLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
