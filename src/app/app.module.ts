import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EsriLoaderService } from 'angular2-esri-loader';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { SearchComponent } from './search/search.component';
import { LayerControlComponent } from './layer-control/layer-control.component';
import { QueryGridComponent } from './query-grid/query-grid.component';
import { PrintComponent } from './print/print.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    SearchComponent,
    LayerControlComponent,
    QueryGridComponent,
    PrintComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [EsriLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
