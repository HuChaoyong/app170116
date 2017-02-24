import { Component, Input, AfterViewInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';


@Component({
  selector: 'app-basemap',
  templateUrl:'./basemap.component.html',
  styleUrls: ['./basemap.component.css']
})
export class BasemapComponent implements AfterViewInit{
  constructor(private esriLoader: EsriLoaderService){}
  @Input('view')
  view: any;

  ngAfterViewInit() {
    return this.esriLoader.load({
          url:'//localhost/arcgis_js_api/library/4.2/init.js'
        }).then(() => {
          this.esriLoader.loadModules([
            "esri/widgets/Legend",// 不知道为什么，只有先引入了 如 Legend 之类的，里面的 view才能传过来。
            "esri/core/Collection",
            "esri/Basemap",
            "esri/layers/WebTileLayer",
            ]).then(([
              Legend,Collection,Basemap,WebTileLayer
              ])=>{
                var _BaseMap1 = new WebTileLayer({
                    id: 'img',
                    urlTemplate: 'http://{subDomain}.tianditu.com/DataServer?T=img_w&x={col}&y={row}&l={level}',
                    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                    copyright: '天地图影像'
                });
                var _BaseMap2 = new WebTileLayer({
                    id:'vec',
                    urlTemplate:'http://{subDomain}.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}',
                    copyright: '天地图矢量',
                    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                    visible: false
                });
                var _BaseMap3 = new WebTileLayer({
                    urlTemplate:'http://{subDomain}.tianditu.com/DataServer?T=cia_w&x={col}&y={row}&l={level}',
                    copyright: '天地图标注',
                    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
                });
                var myCollection = new Collection();
                myCollection.addMany([_BaseMap1, _BaseMap2, _BaseMap3]);
                var customBasemap = new Basemap({
                  baseLayers: myCollection,
                  title: "Custom Basemap",
                  id: "myBasemap"
                });
                this.view.map.basemap = customBasemap;
          });
        });
  }

  toggle(id: string) {
    let img = this.view.map.basemap.baseLayers._items[0];
    let vec = this.view.map.basemap.baseLayers._items[1];
    if ( id == 'img') {
      img.visible = true;
      vec.visible = false;
    } else {
      img.visible = false;
      vec.visible = true;
    }
  }
}