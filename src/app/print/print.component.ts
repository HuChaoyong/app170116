import { Component, Input, OnInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

//<input type="button" value="print" (click)="display()">
//
@Component({
  selector: 'app-print',
  template:`
  <input class="btn btn-primary print" type="button" value="print" (click)="display()">
  `,
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit{
  constructor(private esriLoader: EsriLoaderService){}
  @Input('view')
  view: any;
  printStatus: boolean = false;
  print:any;
  ngOnInit() {
    // when return work immediately , view is undefined ,so I use setTimeout
    setTimeout(()=>{
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
    },2000)
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
