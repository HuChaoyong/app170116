import { Component, Input, AfterViewInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-print',
  template:`
  <input class="btn btn-primary print" type="button" value="print" (click)="display()">
  `,
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements AfterViewInit{
  constructor(private esriLoader: EsriLoaderService){}
  @Input('view')
  view: any;
  printStatus: boolean = false;
  print:any;
  ngAfterViewInit() {
    return this.esriLoader.load({
          url:'//localhost/arcgis_js_api/library/4.2/init.js'
        }).then(() => {
          this.esriLoader.loadModules([
            "esri/widgets/Print",
            'dojo/domReady!'
            ]).then(([
              Print
              ])=>{
                this.print = new Print({
                  view:this.view,
                  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                });
          });
        })
  }
  display():void {
    if(this.printStatus == false){
      this.view.ui.add(this.print,"top-right");
      this.printStatus = true;
    } else {
      this.view.ui.empty("top-right");
      this.printStatus = false;
    }
  }
}
