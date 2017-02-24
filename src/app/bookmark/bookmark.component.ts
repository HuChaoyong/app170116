import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-book-mark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent {

  @Input('view')
  view: any;

  placePosition: any[] = [
    [103,33],
    [105,35]
  ];
  toBookmark(placeId: number){
    this.view.goTo({
      center: this.placePosition[placeId],
      zoom:9
    },{
      duration:1500,
      easing:"ease-in"
    });
  }
}
