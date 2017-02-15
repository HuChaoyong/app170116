import { Component, Input, EventEmitter } from '@angular/core';

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
export class SearchComponent {
  @Input('view')
  view: any;
  search: any = new Search();
  errorStatus: boolean = true;
  ngOnInit() {
    this.search.place("初始化");
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
        })
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
