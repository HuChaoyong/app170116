import { Component, Input, EventEmitter, AfterViewInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

export class Search  {
  constructor(){};
  public tude(longitude: any, latitude: any): string[] {
    if(longitude && latitude){
    console.log('经纬度'+longitude+latitude);
    return [longitude,latitude];
    } else {
      console.error('请用正确的格式输入');
    }
  }
  public place(PlaceName: string ): void {
    console.log('搜索地名'+PlaceName);
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {
  constructor(private esriLoader: EsriLoaderService){}  
  @Input('view')
  view: any;
  point: any;
  graphic: any;
  searchStatus: boolean = true;
  search: any = new Search();
  errorStatus: boolean = true;
  ngAfterViewInit() {
    return this.esriLoader.load({
          url:'//localhost/arcgis_js_api/library/4.2/init.js'
        }).then(() => {
          this.esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            'dojo/domReady!'
            ]).then(([
              Graphic,Point,SimpleMarkerSymbol
              ])=>{
                setInterval(()=>{
                  if(this.searchStatus){
                    this.point = new Point();
                    this.graphic = new Graphic({
                      geometry: this.point,
                      symbol: markSymbol
                    });
                  }
                },1000);
                var markSymbol = new SimpleMarkerSymbol({
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 1
                  }
                });
          });
        })
  }

  doSearch(arr: any[]): void{
    this.errorStatus = true;
    if (arr.length == 2){
      let long = parseFloat(arr[0]);
      let lat = parseFloat(arr[1]);
      console.log('arr=',arr);
      console.log('long',long);
      console.log('lat',lat);
      if( !isNaN(lat) && !isNaN(long) && this.judgeScale(long,lat)){
        this.view.goTo({
          center: [long,lat],
          zoom:11
        },{
          duration:2500,
          easing:"ease-in"
        });
        this.point.longitude = long;
        this.point.latitude = lat;
        this.view.graphics.removeAll();
        this.view.graphics.add(this.graphic);
      }else{
        this.errorStatus = false;
      }
    }
  };  
  judgeScale(lo: number, la: number):boolean {
    let lo2 = lo * lo;
    let la2 = la * la;
    if(lo2 <= 32400 && la2 <= 8100){
      return true;
    }else{
      return false;
    }
  }
}
