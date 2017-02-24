import { Component, AfterViewInit, OnInit, Output, Input,
          ViewChild, ElementRef } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

//<input type="button" value="QueryStart" (click)="startQuery()">
//<input type="button" value="clean" (click)="clean()">
//
@Component({
  selector: 'app-query-grid',
  template:`
<div class="QueryButton">
<input type="button" class="btn btn-primary" value="QueryStart" (click)="startQuery()">
<input type="button" class="btn btn-primary" value="clean" (click)="clean()">
</div>
<div class="claro" [hidden]="!GridStatus">
    <div class="grid">
        <div #grid></div>
    </div>
</div>  
  `,
  styleUrls: ['./query-grid.component.css']
})
export class QueryGridComponent implements AfterViewInit {
  constructor(private esriLoader: EsriLoaderService){}
  @ViewChild('grid') gridEl: ElementRef;
  @Input('view') view:any;
  
  point: any;
  pointGraphic: any;
  polyline: any;
  paths = [];
  polylineGraphic:any;
  print:any;
  queryTask:any;
  query:any;
  resultsLyr:any;
  highLigntSymbol:any;
  yellowSymbol: any;
  grid:any;
  objectStore:any;
  
  QueryStatus: boolean = false;
  GridStatus: boolean = false;  

  ngAfterViewInit() {
    return this.esriLoader.load({
      url:'//localhost/arcgis_js_api/library/4.2/init.js'
    }).then(() => {
      this.esriLoader.loadModules([
        "esri/layers/FeatureLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Print",
        "esri/widgets/Home",

        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",

        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",

        "dojox/grid/DataGrid",
        "dojo/store/Memory",
        "dojo/data/ObjectStore",

        'dojo/domReady!'
      ]).then(([
          FeatureLayer,MapImageLayer,GraphicsLayer,Print,Home,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
          QueryTask,Query,
          DataGrid,Memory,ObjectStore
      ])=>{
        this.resultsLyr = new GraphicsLayer({id: "highLight"});
        var queryUrl = "http://localhost:6080/arcgis/rest/services/Test/SimpleGraphic2/MapServer/0";
        var featureLayer1 = new FeatureLayer({
          url: queryUrl,
          id: "border"
        }); 
        this.view.map.addMany([featureLayer1,this.resultsLyr]);
        var lineSymbol = new SimpleLineSymbol({
          color: [226, 119, 40],
          width: 4
        });
        this.polyline = new Polyline();
        this.polylineGraphic = new Graphic({
          geometry:this.polyline,
          symbol: lineSymbol
        });
        this.view.graphics.add(this.polylineGraphic);

        setInterval(() => {
          if(this.polylineGraphic == null){
            this.polylineGraphic = new Graphic({
              geometry: this.polyline,
              symbol: lineSymbol
            });
          }
        },100);

/************************** Initializing query task *******************************/
        this.queryTask = new QueryTask({
          url: queryUrl
        });
        this.query = new Query({
          returnGeometry: true,
          outFields:["*"]
        });
        this.highLigntSymbol = new SimpleFillSymbol({
          color: [0, 255, 255, 0.2],
          outline: {
            color: [0, 255, 255],
            width: 1
          }
        });
        let yellowSymbol = new SimpleFillSymbol({
          color: [255, 255, 0, 1],
          outline: {
            color: [0, 255, 255],
            width: 1
          }
        });
/****************************** Create grid ******************************************/
        this.objectStore = new ObjectStore({objectStore: new Memory });
        this.grid = new DataGrid({
          query: {id: "*"},
          structure: [
            { name: "Id", field: "id", width: "30px"},
            { name: "Name", field: "name", width: "130px"}
          ]
        },this.gridEl.nativeElement); // it will be given a element there.
        this.grid.startup();
        this.grid.on("RowClick",(evt)=>{
          let tempGraphics = this.view.map.findLayerById("highLight").graphics.items.map((gc)=>{
            if(gc.attributes.FID == this.grid.getItem(evt.rowIndex).pk){
              let tempgraphic = new Graphic({
                attributes:gc.attributes,
                geometry:gc.geometry,
                symbol:yellowSymbol
              });
              return tempgraphic;
            } else {
              let tempgraphic = new Graphic({
                attributes:gc.attributes,
                geometry:gc.geometry,
                symbol:this.highLigntSymbol
              });
              return tempgraphic;              
            }
          });
          this.resultsLyr.removeAll();
          this.resultsLyr.addMany(tempGraphics);          
        });
/******************** Usin view's event to draw *************************/        
        this.view.on("click",($event)=>{
          this.addGraphic($event);
        });
        this.view.on("double-click",($event)=>{
          if($event.button == 0){
            this.stopQuery();
          }
        });
        this.view.on("pointer-move",($event)=>{
          if(this.paths.length>0 && this.QueryStatus ){
            let Kx = (this.view.extent.xmax-this.view.extent.xmin) / this.view.width;
            let Ky = (this.view.extent.ymax-this.view.extent.ymin) / this.view.height;
            let x = this.view.extent.xmin + Kx * $event.x;
            let y = this.view.extent.ymax - Ky * $event.y;
            let XY = this.webMercatorToLatitude(x,y);
            let temp:any[] = this.paths.map((val)=>{
              return val;
            });
            temp[this.paths.length] = XY;
            this.view.graphics.removeAll();
            this.polylineGraphic = new Graphic({
              geometry: this.polyline,
              symbol: lineSymbol
            });            
            this.polylineGraphic.geometry.paths = [temp];
            this.view.graphics.add(this.polylineGraphic);
            //this.polylineGraphic = null;            
          }          
        });

      })
    });
  }

  addGraphic($event: any):void {
    let XY:number[] = [$event.mapPoint.longitude,$event.mapPoint.latitude];
    this.paths.push(XY);

    if(this.paths.length && this.QueryStatus){
      this.view.graphics.removeAll();
      this.polylineGraphic.geometry.paths = [this.paths];
      this.view.graphics.add(this.polylineGraphic);
      this.polylineGraphic = null;
      this.view.graphics.items[0].geometry.paths[0].push(XY);
    }
  }

  startQuery():void {
    console.log('startQuery()');
    this.resultsLyr.removeAll();
    this.QueryStatus = true;
    this.paths.length = 0;
    this.polylineGraphic = null;
    this.GridStatus = false;
  }

  stopQuery():void {
    console.log('stopQuery()');
    this.QueryStatus = false;
    this.polylineGraphic = 0;
    this.view.graphics.removeAll();
    this.GridStatus = true;
    this.query.geometry = this.polyline;

    this.queryTask.execute(this.query).then((results) => {
      //console.log('results = ',results);
      var peakResults = results.features.map((feature) => {
        feature.symbol = this.highLigntSymbol;
        return feature;
      });
      //console.log("feature",peakResults);
      this.resultsLyr.addMany(peakResults);

/*************************************************** grid operate **********************************/
      var data = results.features.map((feature) => {
        // pk is a unique key value.
        return {id:feature.attributes.Id,name:feature.attributes.name,pk:feature.attributes.FID};
      });
    this.objectStore.objectStore.setData(data);
    this.grid._setStore(this.objectStore);
    this.grid.setQuery({id:"*"});
         
          });
/*******************************************************************************************/
    this.paths.length = 0;
  }
  clean():void {
    this.GridStatus = false;
    this.resultsLyr.removeAll();
  }
  webMercatorToLatitude(x: number, y: number): number[]{
    var LoLa = [0,0];
    LoLa[0] = x/20037508.34*180;
    var temp0 = y/20037508.34*180;
    LoLa[1] = 180/Math.PI*(2*Math.atan(Math.exp(temp0*Math.PI/180))-Math.PI/2);
    return LoLa;
  }  
}
