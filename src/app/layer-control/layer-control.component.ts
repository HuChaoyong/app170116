import { Component, Input, AfterViewInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-layer-control',
  templateUrl:'./layer-control.component.html',
  styleUrls: ['./layer-control.component.css']
})
export class LayerControlComponent implements AfterViewInit{
  @Input('view') view:any;
  constructor(private esriLoader: EsriLoaderService){}

  ngAfterViewInit() {
      return this.esriLoader.load({
            url:'//localhost/arcgis_js_api/library/4.2/init.js'
          }).then(() => {
            this.esriLoader.loadModules([
              "esri/widgets/Legend",
              ]).then(([
                Legend
                ])=>{
                  setTimeout(()=>{
                  let lay = this.view.map.findLayerById('border');//('border')
                  var legend = new Legend({
                    view: this.view,
                    layerInfos: [
                      {
                        title: "",
                        layer: lay
                      },
                      {
                        title: "",
                        layer: this.view.map.findLayerById('base1')
                      },
                      {
                        title: "test",
                        layer: this.view.map.findLayerById('base2')
                      }
                    ]
                  });
                  this.view.ui.add(legend, "bottom-left");
                  },2000)
            });
          })
    }  

  visibleChange(id: string, opacity: string): void {
    let Layer = this.view.map.findLayerById(id);
    Layer.visible = !Layer.visible;
    Layer.opacity = parseFloat(opacity);
  }
}