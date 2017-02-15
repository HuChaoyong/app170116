import { 
  Component, 
  OnInit, 
  ViewChild, 
  ElementRef, 
  Renderer, 
  EventEmitter } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  template:`
  <div class="map1" #MapView ></div>
  <app-search [view]="view"></app-search>
  <app-layer-control  [view]="view"></app-layer-control>
  <app-query-grid [view]="view"></app-query-grid>
  <app-print [view]="view"></app-print>
  `,
  styleUrls: ['./esri-map.component.css'],
})
export class EsriMapComponent implements OnInit {
  @ViewChild('MapView') mapEl: ElementRef;

  view: any;
  print:any;
  constructor(private esriLoader: EsriLoaderService,
                      _renderer: Renderer,
                      _elementRef: ElementRef
  ) { }
 
  ngOnInit() {
    return this.esriLoader.load({
      url:'//localhost/arcgis_js_api/library/4.2/init.js'
    }).then(() => {
      this.esriLoader.loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/Basemap",
        "esri/layers/MapImageLayer",
        "esri/widgets/Home",
        'dojo/domReady!'
        ]).then(([
          Map,MapView,Basemap,MapImageLayer,Home,
          ])=>{
          var mapServer = new MapImageLayer({
                    url: "https://www.land-info.cn/arcgis/rest/services/Conservation_KLK/SSL_SubArea/MapServer",
                    id: "ssl"
                  });
          var customBasemap = new Basemap({
            baseLayers: [mapServer],
            title: "Custom Basemap",
            id: "myBasemap"
          }) 
          var map = new Map({
            basemap: 'hybrid'
          });
          this.view = new MapView({
            container: this.mapEl.nativeElement,
            map: map,
            center:[103.785, 30.935],
            //center:[97.23, 37.22],
            zoom: 8
          });
          var homeWidget = new Home({
            view: this.view
          });
          this.view.ui.add(homeWidget,"top-left");
      });
    })
  }
}
